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

router.get("/available-seats/:showId", async (req, res) => {
  const { showId } = req.params;
  try {
    const [seats] = await db.query(
      "SELECT show_id, seat_id, `Seat Row`, `Seat Number`, Status, Available FROM v_seat_availability WHERE show_id = ? ORDER BY `Seat Row` ASC, `Seat Number` ASC",
      [showId],
    );

    if (seats.length === 0) {
      return res.status(404).json({ error: "Show not found." });
    }

    res.status(200).json(seats);
  } catch (error) {
    console.error("Fel vid hämtning av lediga platser.", error);
    res
      .status(500)
      .json({ error: "Kunde inte hämta lediga platser från databasen" });
  }
});

module.exports = router;
