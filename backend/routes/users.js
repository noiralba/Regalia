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
  const offsetValue = req.query.offset ?? "0";
  const limit = 2; // Antal tidigare bokningar som visas per laddning

  // Validera att offset är ett giltigt heltal (0 eller större)
  if (
    typeof offsetValue !== "string" ||
    !/^(0|[1-9]\d*)$/.test(offsetValue) ||
    !Number.isSafeInteger(Number(offsetValue))
  ) {
    return res.status(400).json({ error: "Ogiltigt offset-värde." });
  }

  const offset = Number(offsetValue);

  try {
    const sql = `
      SELECT 
        booking_id, 
        booking_number,
        status,
        movie_title, 
        show_date, 
        show_time, 
        screen_name,
        seat_count,
        seats,
        total_price_sek,
        raw_date,
        raw_time
      FROM v_user_booking_history
      WHERE user_id = ?
      ORDER BY raw_date ASC, raw_time ASC, booking_id ASC
    `;

    const [results] = await db.query(sql, [req.params.id]);
    const now = new Date();

    const upcoming = [];
    const allPast = [];

    for (const row of results) {
      const showDateTime = new Date(`${row.show_date}T${row.show_time}:00`);
      const { raw_date: _raw_date, raw_time: _raw_time, ...booking } = row;

      if (showDateTime >= now && booking.status !== "CANCELLED") {
        upcoming.push(booking);
      } else {
        allPast.push(booking);
      }
    }

    // Vänd ordningen så att den senaste passerade visningen ligger först
    allPast.reverse();

    // Applicera paginering på past-listan utifrån offset
    const paginatedPast = allPast.slice(offset, offset + limit);
    const hasMore = offset + limit < allPast.length;

    return res.status(200).json({
      upcoming,
      past: paginatedPast,
      hasMore,
    });
  } catch (error) {
    console.error("GET /users/:id/bookings:", error.message);
    return res.status(500).json({ error: "Ett serverfel uppstod." });
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
