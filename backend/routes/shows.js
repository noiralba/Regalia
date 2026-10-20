const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [shows] = await db.query("SELECT * FROM v_movie_screenings");
    res.status(200).json(shows);
  } catch (error) {
    console.error("GET /shows:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

//här måste jag till en getbyid

// GET: Hämta en visning via UUID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [shows] = await db.query(
      "SELECT * FROM v_movie_screenings WHERE show_id = ?",
      [id],
    );
    if (shows.length === 0) {
      return res.status(404).json({ error: "Show not found." });
    }

    res.status(200).json(shows[0]);
  } catch (error) {
    console.error("GET /shows/:id:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});
module.exports = router;
