const express = require("express");
const router = express.Router();
const db = require("../db.js");

// GET: Hämta alla filmer
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM movies");

    res.json(results);
  } catch (err) {
    console.error("Fel vid hämtning av filmer:", err);

    res.status(500).json({
      error: "Kunde inte hämta filmerna",
    });
  }
});

// GET: Hämta en film baserat på ID
router.get("/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const [results] = await db.query("SELECT * FROM movies WHERE id = ?", [movieId]);
    if (results.length === 0) {
      return res.status(404).json({ error: "Film hittades inte" });
    }
    res.json(results[0]);
  } catch (err) {
    console.error("Fel vid hämtning av film:", err);
    res.status(500).json({ error: "Kunde inte hämta filmen" });
  }
});

module.exports = router;
