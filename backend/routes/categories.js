const express = require("express");
const router = express.Router();
const db = require("../db.js");

router.get("/", async (req, res) => {
  try {
    const [categories] = await db.query(
      "SELECT id, name FROM categories ORDER BY name ASC",
    );
    res.status(200).json(categories);
  } catch (error) {
    console.error("GET /categories:", error.message);
    res
      .status(500)
      .json({ error: "Kunde inte hämta kategorier från databasen." });
  }
});

module.exports = router;
