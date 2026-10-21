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
    return res.status(500).json({
      error: "Could not retrieve shows from the database.",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const shows = await getMovieScreenings(id);
    if (shows.length === 0) {
      const error = new Error("Show not found");
      error.statusCode = 404;
      error.publicMessage = "Visning hittades inte.";
      throw error;
    }
    res.status(200).json(shows[0]);
  } catch (error) {
    console.error("GET /shows/:id:", error.message);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.publicMessage });
    }

    return res.status(500).json({
      error: "Server error. Could not retrieve show details.",
    });
  }
});

module.exports = router;
