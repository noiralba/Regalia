const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/movie-themes", async (req, res) => {
  const { movie_id, theme_id } = req.body;

  if (!movie_id || !theme_id) {
    return res.status(400).json({
      error: "Både movie_id och theme_id måste skickas med.",
    });
  }

  try {
    await db.query(
      "INSERT INTO movie_themes (movie_id, theme_id) VALUES (?, ?)",
      [movie_id, theme_id],
    );

    res.status(201).json({
      message: "Filmen har kopplats till temat framgångsrikt.",
    });
  } catch (error) {
    console.error("POST /movie-themes:", error.message);

    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      return res.status(409).json({
        error: "Den här filmen är redan kopplad till detta tema.",
      });
    }

    res.status(500).json({ error: "Kunde inte spara temakopplingen." });
  }
});

router.get("/", async (req, res) => {
  try {
    const [themes] = await db.query(
      "SELECT id, name FROM themes WHERE is_active = TRUE",
    );
    res.json(themes);
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta teman." });
  }
});

router.get("/themes/with-movies", async (req, res) => {
  try {
    const sql = `
      SELECT 
        t.id AS theme_id,
        t.name AS theme_name,
        t.description AS theme_description,
        COALESCE(
          JSON_ARRAYAGG(
            IF(m.id IS NOT NULL, 
              JSON_OBJECT(
                'id', m.id,
                'title', m.title,
                'posterImage', m.posterImage
              ), 
              NULL
            )
          ), 
          JSON_ARRAY()
        ) AS movies
      FROM themes t
      LEFT JOIN movie_themes mt ON t.id = mt.theme_id
      LEFT JOIN movies m ON mt.movie_id = m.id
      WHERE t.is_active = TRUE
      GROUP BY t.id
    `;

    const [themes] = await db.query(sql);

    const formattedThemes = themes.map((theme) => ({
      ...theme,
      movies: Array.isArray(theme.movies)
        ? theme.movies.filter((m) => m !== null)
        : [],
    }));

    res.json(formattedThemes);
  } catch (error) {
    console.error("Fel vid hämtning av teman med filmer:", error);
    res.status(500).json({ error: "Kunde inte hämta temafilmer." });
  }
});

module.exports = router;
