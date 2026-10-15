const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const { randomUUID } = require("node:crypto");
const requireAuth = require("../middleware/requireAuth");
const requireOwnUser = require("../middleware/requireOwnUser");
const { registerLimiter } = require("../middleware/rateLimit");

router.post("/", registerLimiter, async (req, res) => {
  const { first_name, last_name, email, password } = req.body ?? {};

  if (
    [first_name, last_name, email, password].some(
      (value) => typeof value !== "string" || !value.trim(),
    )
  ) {
    return res.status(400).json({
      error: "Alla fält måste fyllas i.",
    });
  }

  if (Array.from(password).length < 15) {
    return res.status(400).json({
      error: "Lösenordet måste innehålla minst 15 tecken.",
    });
  }

  const firstName = first_name.trim();
  const lastName = last_name.trim();
  const userEmail = email.trim().toLowerCase();

  if (
    firstName.length > 100 ||
    lastName.length > 100 ||
    userEmail.length > 150 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({
      error: "Ett eller flera fält är för långa.",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
    return res.status(400).json({
      error: "Ogiltig e-postadress.",
    });
  }

  try {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.execute(
      `INSERT INTO users (id, first_name, last_name, email, password, role)
  VALUES (?, ?, ?, ?, ?, ?)`,
      [id, firstName, lastName, userEmail, hashedPassword, "customer"],
    );

    return res.status(201).json({
      id,
      first_name: firstName,
      last_name: lastName,
      email: userEmail,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "E-postadressen används redan.",
      });
    }

    console.error("POST /users:", error.message);

    return res.status(500).json({
      error: "Ett serverfel uppstod.",
    });
  }
});

router.get("/:id", requireAuth, requireOwnUser, async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.execute(
      `SELECT id, first_name, last_name, email
       FROM users
       WHERE id = ?`,
      [id],
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: "Användaren hittades inte.",
      });
    }

    return res.status(200).json(users[0]);
  } catch (error) {
    console.error("GET /users/:id:", error.message);

    return res.status(500).json({
      error: "Ett serverfel uppstod.",
    });
  }
});

router.get("/:id/bookings", requireAuth, requireOwnUser, async (req, res) => {
  const period = req.query.period ?? "upcoming";
  const offsetValue = req.query.offset ?? "0";

  if (!["upcoming", "past"].includes(period)) {
    return res.status(400).json({
      error: "Ogiltig period.",
    });
  }

  if (
    typeof offsetValue !== "string" ||
    !/^(0|[1-9]\d*)$/.test(offsetValue) ||
    !Number.isSafeInteger(Number(offsetValue))
  ) {
    return res.status(400).json({
      error: "Ogiltigt offset-värde.",
    });
  }

  if (period === "upcoming" && req.query.offset !== undefined) {
    return res.status(400).json({
      error: "Offset kan endast användas för tidigare bokningar.",
    });
  }

  const offset = Number(offsetValue);
  const comparison = period === "upcoming" ? ">=" : "<";
  const direction = period === "upcoming" ? "ASC" : "DESC";

  try {
    const sql = `
      SELECT
        b.id AS booking_id,
        m.title AS movie_title,
        DATE_FORMAT(s.date, '%Y-%m-%d') AS show_date,
        TIME_FORMAT(s.time, '%H:%i:%s') AS show_time,
        COUNT(bs.id) AS seat_count
      FROM bookings b
      JOIN booked_seats bs ON bs.booking_id = b.id
      JOIN shows s ON s.id = bs.show_id
      JOIN movies m ON m.id = s.movie_id
      WHERE b.user_id = ?
        AND TIMESTAMP(s.date, s.time) ${comparison} NOW()
      GROUP BY b.id, s.id, m.title, s.date, s.time
      ORDER BY s.date ${direction}, s.time ${direction}, b.id ${direction}
      ${period === "past" ? "LIMIT ? OFFSET ?" : ""}
    `;

    const parameters =
      period === "past" ? [req.params.id, 3, offset] : [req.params.id];

    const [results] = await db.query(sql, parameters);

    return res.status(200).json({
      bookings: period === "past" ? results.slice(0, 2) : results,
      hasMore: period === "past" && results.length > 2,
    });
  } catch (error) {
    console.error("GET /users/:id/bookings:", error.message);

    return res.status(500).json({
      error: "Ett serverfel uppstod.",
    });
  }
});

router.patch("/:id", requireAuth, requireOwnUser, async (req, res) => {
  const changes = {};
  const allowedFields = ["first_name", "last_name", "email"];
  const body = req.body ?? {};

  if (
    Object.keys(body).length === 0 ||
    Object.keys(body).some((field) => !allowedFields.includes(field))
  ) {
    return res.status(400).json({
      error: "Inga giltiga fält att uppdatera.",
    });
  }

  for (const field of allowedFields) {
    if (body[field] === undefined) continue;

    if (typeof body[field] !== "string" || !body[field].trim()) {
      return res.status(400).json({
        error: "Ogiltiga uppgifter.",
      });
    }

    const value = body[field].trim();
    const maxLength = field === "email" ? 150 : 100;

    if (value.length > maxLength) {
      return res.status(400).json({
        error: "Ett fält är för långt.",
      });
    }

    changes[field] = field === "email" ? value.toLowerCase() : value;
  }

  if (changes.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changes.email)) {
    return res.status(400).json({
      error: "Ogiltig e-postadress.",
    });
  }

  try {
    const fields = Object.keys(changes);
    const setClause = fields.map((field) => `${field} = ?`).join(", ");

    const [result] = await db.execute(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      [...Object.values(changes), req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Användaren hittades inte.",
      });
    }

    return res.status(200).json({
      message: "Användaren uppdaterades.",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "E-postadressen används redan.",
      });
    }

    console.error("PATCH /users/:id:", error.message);

    return res.status(500).json({
      error: "Ett serverfel uppstod.",
    });
  }
});

router.delete("/:id", requireAuth, requireOwnUser, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Användaren hittades inte.",
      });
    }

    return res.status(204).send();
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        error: "Användaren har kopplad data och kan inte tas bort.",
      });
    }

    console.error("DELETE /users/:id:", error.message);

    return res.status(500).json({
      error: "Ett serverfel uppstod.",
    });
  }
});

module.exports = router;
