const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM seats");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Fel vid hämtning av platser.", error);
    res.status(500).json({ error: "Kunde inte hämta platser från databasen" });
  }
});

// hämta lediga platser specifik visning
router.get("/available/:showId", async (req, res) => {
  const { showId } = req.params;
  try {
    const [shows] = await db.query("SELECT screen_id FROM shows WHERE id = ?", [
      showId,
    ]);
    if (shows.length === 0) {
      return res.status(404).json({ error: "Visningen hittades inte" });
    }

    const screenId = shows[0].screen_id;

    // hämtar alla platser som tillhör salongen
    const [seats] = await db.query("SELECT * FROM seats WHERE screen_id = ?", [
      screenId,
    ]);

    //hämtar platser som redan är bokade för visnignen
    const [bookedSeats] = await db.query(
      "SELECT seat_id FROM booked_seats WHERE show_id = ?",
      [showId],
    );

    const bookedSeatIds = bookedSeats.map((seat) => seat.seat_id);
    // filtrerar bort bokade platser och behåller lediga
    const availableSeats = seats.filter(
      (seat) => !bookedSeatIds.includes(seat.id),
    );

    res.status(200).json(availableSeats);
  } catch (error) {
    console.error("Fel vid hämtning av lediga platser.", error);
    res
      .status(500)
      .json({ error: "Kunde inte hämta lediga platser från databasen" });
  }
});

module.exports = router;
