const express = require("express");
const router = express.Router();
const db = require("../db");
const { randomUUID } = require("crypto");
const { getBookingConfirmation } = require("../services/bookingService");

// PUT: Uppdatera en bokning via ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, user_email } = req.body;

  if (!user_email) {
    return res.status(400).json({
      error: "user_email is required.",
    });
  }

  try {
    const [existingBookings] = await db.query(
      "SELECT id FROM bookings WHERE id = ?",
      [id],
    );

    if (existingBookings.length === 0) {
      return res.status(404).json({ error: "Booking not found." });
    }

    await db.query(
      "UPDATE bookings SET user_id = ?, user_email = ? WHERE id = ?",
      [user_id ?? null, user_email, id],
    );

    const [updatedBookings] = await db.query(
      "SELECT * FROM bookings WHERE id = ?",
      [id],
    );

    res.status(200).json(updatedBookings[0]);
  } catch (error) {
    console.error("PUT /bookings/:id:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

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

// POST: Skapa en bokning med platser och returnera kvitto
router.post("/", async (req, res) => {
  const { user_id, user_email, show_id, seats } = req.body;

  if (!user_email || !show_id || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({
      error: "user_email, show_id and at least one seat are required.",
    });
  }

  if (seats.some((seat) => !seat.seat_id || !seat.ticket_type_id)) {
    return res.status(400).json({
      error: "Every seat must have seat_id and ticket_type_id.",
    });
  }

  const id = randomUUID();
  const booking_number = `REG-${randomUUID()}`;
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Kontrollera att visningen finns
    const [shows] = await connection.query(
      "SELECT id FROM shows WHERE id = ?",
      [show_id],
    );

    if (shows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Show not found." });
    }

    // Skapa bokningen
    await connection.query(
      `INSERT INTO bookings
        (id, user_id, user_email, booking_number)
       VALUES (?, ?, ?, ?)`,
      [id, user_id ?? null, user_email, booking_number],
    );

    // Spara varje plats i bokningen
    for (const seat of seats) {
      await connection.query(
        `INSERT INTO booked_seats
          (id, booking_id, show_id, seat_id, ticket_type_id)
         VALUES (?, ?, ?, ?, ?)`,
        [randomUUID(), id, show_id, seat.seat_id, seat.ticket_type_id],
      );
    }

    // Hämta kvittot innan transaktionen avslutas
    const receiptQuery = `
      SELECT
        b.id AS boknings_id,
        b.booking_number AS bokningsnummer,
        m.title AS filmtitel,
        s.date AS visningsdatum,
        s.time AS visningstid,
        GROUP_CONCAT(
          CONCAT(
            'Rad ', se.seat_row,
            ' Plats ', se.seat_number,
            ' (', tt.name, ': ', FORMAT(tt.price, 2), ' kr)'
          )
          ORDER BY se.seat_row, se.seat_number
          SEPARATOR ', '
        ) AS platser_och_priser,
        SUM(tt.price) AS totalt_pris
      FROM bookings b
      JOIN booked_seats bs ON b.id = bs.booking_id
      JOIN shows s ON bs.show_id = s.id
      JOIN movies m ON s.movie_id = m.id
      JOIN seats se ON bs.seat_id = se.id
      JOIN ticket_types tt ON bs.ticket_type_id = tt.id
      WHERE b.id = ?
      GROUP BY
        b.id,
        b.booking_number,
        m.title,
        s.date,
        s.time
    `;

    const [receipt] = await connection.query(receiptQuery, [id]);

    if (receipt.length === 0) {
      throw new Error("Booking receipt could not be generated.");
    }

    await connection.commit();

    return res.status(201).json(receipt[0]);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("POST /bookings:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error: "One of the selected seats is already booked for this show.",
      });
    }

    return res.status(500).json({ error: "Server error." });
  } finally {
    if (connection) {
      connection.release();
    }
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
