const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const { randomUUID } = require("node:crypto");

// Tillfälligt skydd tills autentisering är implementerad
router.use((req, res) => {
  return res.status(403).json({
    error: "Åtkomst till användare är inte tillåten ännu",
  });
});

// POST: Skapa en användare
router.post("/", async (req, res) => {
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

// GET: Hämta en användare via ID
router.get("/:id", async (req, res) => {
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

// PATCH: Uppdatera användarens kontouppgifter
router.patch("/:id", async (req, res) => {
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

// DELETE: Ta bort en användare via ID
router.delete("/:id", async (req, res) => {
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
