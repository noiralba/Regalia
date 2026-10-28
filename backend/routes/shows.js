const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { getMovieScreenings, createShow } = require("../services/showService");

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

router.post("/", async (req, res) => {
  const { movie_id, screen_id, date, time } = req.body;

  if (!movie_id || !screen_id || !date || !time) {
    return res.status(400).json({
      error: "Fälten movie_id, screen_id, date och time är obligatoriska.",
    });
  }

  try {
    const id = crypto.randomUUID();

    const newShow = await createShow({
      id,
      movie_id,
      screen_id,
      date,
      time,
    });

    res.status(201).json({
      message: "Visningen har skapats framgångsrikt.",
      show: newShow,
    });
  } catch (error) {
    console.error("POST /shows:", error.message);

    if (
      error.code === "ER_NO_REFERENCED_ROW_2" ||
      error.code === "ER_NO_REFERENCED_ROW"
    ) {
      return res.status(400).json({
        error: "Angivet movie_id eller screen_id existerar inte i databasen.",
      });
    }

    return res.status(500).json({
      error: "Kunde inte skapa visningen i databasen.",
    });
  }
});

module.exports = router;
