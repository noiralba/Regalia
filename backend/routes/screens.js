const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM  screens");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Fel vid hämtning av salonger.", error);
    res.status(500).json({ error: "Kunde inte hämta salonger från databasen" });
  }
});

module.exports = router;
