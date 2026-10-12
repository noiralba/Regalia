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

module.exports = router;
