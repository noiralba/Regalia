const express = require("express");
const router = express.Router();
const db = require("../db");
const { randomUUID } = require("crypto");
const { getBookingConfirmation } = require("../services/bookingService");

// GET: Hämta alla bokningar
router.get("/", async (req, res) => {
  try {
    const [bookings] = await db.query("SELECT * FROM bookings");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("GET /bookings:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

// POST: Skapa en bokning
router.post("/", async (req, res) => {
  const { user_id, user_email } = req.body;

  if (!user_email) {
    return res.status(400).json({
      error: "user_email is required.",
    });
  }

  const id = randomUUID();
  const booking_number = `REG-${randomUUID()}`;

  try {
    await db.query(
      `INSERT INTO bookings
        (id, user_id, user_email, booking_number)
       VALUES (?, ?, ?, ?)`,
      [id, user_id ?? null, user_email, booking_number],
    );

    res.status(201).json({
      id,
      user_id: user_id ?? null,
      user_email,
      booking_number,
    });
  } catch (error) {
    console.error("POST /bookings:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

// GET: Hämta bokningsbekräftelse via bokningsnummer
router.get("/:bookingNumber", async (req, res) => {
  try {
    const confirmation = await getBookingConfirmation(req.params.bookingNumber);

    if (!confirmation) {
      return res.status(404).json({ error: "Booking not found." });
    }

    res.status(200).json(confirmation);
  } catch (error) {
    console.error("GET /bookings/:bookingNumber:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
