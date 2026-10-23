const express = require("express");
const router = express.Router();
const db = require("../db.js");
const { getMovies } = require("../services/movieService.js");

const CATEGORIES_SUBQUERY = `
  (SELECT COALESCE(JSON_ARRAYAGG(c.name), JSON_ARRAY())
   FROM movie_categories mc
   JOIN categories c ON c.id = mc.category_id
   WHERE mc.movie_id = m.id) AS categories
`;

// GET: Get all movies with optional filters for ageRating, categories, and search term
router.get("/", async (req, res) => {
  try {
    const { ageRating, categories, search } = req.query;

    let sql = `
      SELECT m.*,
        ${CATEGORIES_SUBQUERY}
      FROM movies m
    `;

    const conditions = [];
    const params = [];

    if (ageRating !== undefined) {
      const age = Number(ageRating);
      if (Number.isNaN(age) || age < 0) {
        return res
          .status(400)
          .json({ error: "ageRating måste vara ett positivt tal" });
      }
      conditions.push("m.ageRating = ?");
      params.push(age);
    }

    if (categories) {
      conditions.push(`EXISTS (
        SELECT 1
        FROM movie_categories mc2
        JOIN categories c2 ON c2.id = mc2.category_id
        WHERE mc2.movie_id = m.id AND c2.name = ?
      )`);
      params.push(categories);
    }

    if (search) {
      if (search.length < 2) {
        return res.status(400).json({ error: "Sökordet är för kort" });
      }
      conditions.push(
        "(m.title LIKE ? OR m.shortDescription LIKE ? OR m.longDescription LIKE ?)",
      );
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    const [results] = await db.query(sql, params);

    res.json(results);
  } catch (err) {
    console.error("Fel vid hämtning av filmer:", err);

    res.status(500).json({
      error: "Kunde inte hämta filmerna",
    });
  }
});

router.get("/type/:filter", async (req, res, next) => {
  const { filter } = req.params;

  if (filter !== "latest" && filter !== "upcoming") {
    return next();
  }

  try {
    const movies = await getMovies({ type: filter, limit: 15 });
    res.status(200).json(movies);
  } catch (error) {
    console.error(`GET /movies/type/${filter}:`, error.message);
    return res.status(500).json({
      error: `Could not retrieve ${filter} movies from the database.`,
    });
  }
});

// GET: Get a specific movie by ID
router.get("/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const [results] = await db.query(
      `SELECT m.*, ${CATEGORIES_SUBQUERY}
      FROM movies m
      WHERE m.id = ? `,
      [movieId],
    );
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
