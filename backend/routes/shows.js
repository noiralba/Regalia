const express = require("express");
const router = express.Router();
const { getMovieScreenings } = require("../services/showService");

router.get("/", async (req, res) => {
  const { date, movie_id, age_rating, category } = req.query;

  try {
    const shows = await getMovieScreenings(null, {
      date,
      movie_id,
      age_rating,
      category,
    });
    res.status(200).json(shows);
  } catch (error) {
    console.error("GET /shows:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const shows = await getMovieScreenings(id);
    if (shows.length === 0) {
      return res.status(404).json({ error: "Show not found." });
    }
    res.status(200).json(shows);
  } catch (error) {
    console.error("GET /shows/:id:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
