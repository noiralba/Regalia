const express = require("express");
const router = express.Router();
const db = require("../db");
const {
  getAllThemesAdmin,
  getThemeById,
  themeNameExists,
  createTheme,
  updateTheme,
  deleteTheme,
} = require("../services/themeService");

// ---- Hjälpfunktioner för validering ----
function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseBoolean(value) {
  if (value === undefined) return undefined;
  return value === true || value === 1 || value === "1" || value === "true";
}

// undefined = fältet skickades inte, annars en lista med unika ID:n (eller null vid fel)
function parseMovieIds(value) {
  if (value === undefined) return undefined;
  if (
    !Array.isArray(value) ||
    value.some((id) => typeof id !== "string" || !id)
  ) {
    return null;
  }
  return [...new Set(value)];
}

function isForeignKeyError(error) {
  return (
    error.code === "ER_NO_REFERENCED_ROW_2" ||
    error.code === "ER_NO_REFERENCED_ROW"
  );
}

// =========================================================================
// BEFINTLIGA (PUBLIKA) RUTTER
// =========================================================================

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
    console.error("Fel vid hämtning av teman med filmer:", error);
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

// =========================================================================
// ADMIN: FULLSTÄNDIG CRUD FÖR TEMAN
// =========================================================================

// GET: Alla teman (även inaktiva) med antal filmer och film-ID:n
router.get("/admin/all", async (req, res) => {
  try {
    const themes = await getAllThemesAdmin();
    res.json(themes);
  } catch (error) {
    console.error("GET /themes/admin/all:", error);
    res
      .status(500)
      .json({ error: "Kunde inte hämta teman för administration." });
  }
});

// POST: Skapa ett tema, med valfria filmer
router.post("/", async (req, res) => {
  const name = cleanText(req.body?.name);
  const description = cleanText(req.body?.description) || null;
  const isActive = parseBoolean(req.body?.is_active) ?? true;
  const parsedMovieIds = parseMovieIds(req.body?.movie_ids);

  if (!name) {
    return res.status(400).json({ error: "Namn är obligatoriskt." });
  }
  if (name.length > 100) {
    return res.status(400).json({ error: "Namnet får vara högst 100 tecken." });
  }
  if (parsedMovieIds === null) {
    return res
      .status(400)
      .json({ error: "movie_ids måste vara en lista med ID:n." });
  }
  const movieIds = parsedMovieIds ?? [];

  try {
    if (await themeNameExists(name)) {
      return res
        .status(409)
        .json({ error: "Det finns redan ett tema med det namnet." });
    }

    const theme = await createTheme(
      { name, description, is_active: isActive },
      movieIds,
    );
    res.status(201).json({ message: "Temat har skapats.", theme });
  } catch (error) {
    console.error("POST /themes:", error);
    if (isForeignKeyError(error)) {
      return res
        .status(400)
        .json({ error: "En eller flera av filmerna finns inte." });
    }
    res.status(500).json({ error: "Kunde inte skapa temat." });
  }
});

// PUT: Uppdatera ett tema. Fält som inte skickas behåller sitt värde.
// Skickas inte movie_ids lämnas filmkopplingarna orörda.
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await getThemeById(id);
    if (!existing) {
      return res.status(404).json({ error: "Temat hittades inte." });
    }

    const body = req.body ?? {};
    const name = body.name !== undefined ? cleanText(body.name) : existing.name;
    const movieIds = parseMovieIds(body.movie_ids);
    const isActive = parseBoolean(body.is_active);

    if (!name) {
      return res.status(400).json({ error: "Namn kan inte lämnas tomt." });
    }
    if (name.length > 100) {
      return res
        .status(400)
        .json({ error: "Namnet får vara högst 100 tecken." });
    }
    if (movieIds === null) {
      return res
        .status(400)
        .json({ error: "movie_ids måste vara en lista med ID:n." });
    }
    if (await themeNameExists(name, id)) {
      return res
        .status(409)
        .json({ error: "Det finns redan ett tema med det namnet." });
    }

    const updateData = {
      name,
      description:
        body.description !== undefined
          ? cleanText(body.description) || null
          : existing.description,
      is_active: isActive !== undefined ? isActive : existing.is_active,
    };

    await updateTheme(id, updateData, movieIds === undefined ? null : movieIds);
    res.json({ message: "Temat har uppdaterats." });
  } catch (error) {
    console.error("PUT /themes/:id:", error);
    if (isForeignKeyError(error)) {
      return res
        .status(400)
        .json({ error: "En eller flera av filmerna finns inte." });
    }
    res.status(500).json({ error: "Kunde inte uppdatera temat." });
  }
});

// DELETE: Radera ett tema (filmkopplingarna försvinner, filmerna finns kvar)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteTheme(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Temat hittades inte." });
    }
    res.json({ message: "Temat har raderats." });
  } catch (error) {
    console.error("DELETE /themes/:id:", error);
    res.status(500).json({ error: "Kunde inte radera temat." });
  }
});

module.exports = router;
