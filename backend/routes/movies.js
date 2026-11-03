const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db.js");
const {
  getMovies,
  getAllMoviesAdmin,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../services/movieService.js");



// =========================================================================
// FILHANTERING (multer + hjälpfunktioner för städning)
// =========================================================================

const BASE_DIR = path.join(
  __dirname,
  "../../frontend/src/assets/images/movies",
);
const THUMB_DIR = path.join(BASE_DIR, "thumbnails");

const POSTER_URL = "/images/movies/";
const THUMB_URL = "/images/movies/thumbnails/";

// Skapa mapparna om de saknas (multer gör det inte själv)
fs.mkdirSync(THUMB_DIR, { recursive: true });

// Ta bort en fil utan att krascha om den redan är borta
function removeFile(fullPath) {
  fs.unlink(fullPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Kunde inte ta bort fil:", fullPath, err);
    }
  });
}

// Ta bort filer som multer nyss sparade (används när något går fel)
function removeUploaded(files) {
  if (!files) return;
  Object.values(files)
    .flat()
    .forEach((f) => removeFile(f.path));
}

// language är en JSON-kolumn med formen {"original": "Engelska", "subtitles": "Svenska"}.
// Returnerar en JSON-sträng, null (båda tomma) eller undefined (fältet skickades inte alls).
function parseLanguage(input) {
  if (input === undefined) return undefined;
  if (input === null || String(input).trim() === "") return null;

  let obj;
  try {
    obj = typeof input === "string" ? JSON.parse(input) : input;
  } catch {
    return null;
  }
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;

  const original = String(obj.original ?? "").trim();
  const subtitles = String(obj.subtitles ?? "").trim();
  if (!original && !subtitles) return null;

  return JSON.stringify({ original, subtitles });
}

// Gör om ett befintligt JSON-värde från databasen till något som kan skrivas tillbaka
function toJsonValue(value) {
  if (value === null || value === undefined) return null;
  return typeof value === "string" ? value : JSON.stringify(value);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Sortera upp filerna baserat på fältnamnet från frontend
    cb(null, file.fieldname === "posterThumbnail" ? THUMB_DIR : BASE_DIR);
  },
  filename: (req, file, cb) => {
    // Samma basnamn för poster och miniatyr i samma request, så att
    // getMovieImage kan byta mapp mellan movies/ och movies/thumbnails/
    if (!req.uploadBaseName) {
      req.uploadBaseName = Date.now() + "-" + Math.round(Math.random() * 1e4);
    }
    cb(null, req.uploadBaseName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const CATEGORIES_SUBQUERY = `
  (SELECT COALESCE(JSON_ARRAYAGG(c.name), JSON_ARRAY())
   FROM movie_categories mc
   JOIN categories c ON c.id = mc.category_id
   WHERE mc.movie_id = m.id) AS categories
`;

// =========================================================================
// 1. CRUD & ADMIN-ÄNDPUNKTER
// =========================================================================

// GET: Hämta rålista över alla filmer till admin-tabellen
router.get("/admin/all", async (req, res) => {
  try {
    const movies = await getAllMoviesAdmin();
    res.json(movies);
  } catch (err) {
    console.error("Fel vid hämtning av admin-filmer:", err);
    res
      .status(500)
      .json({ error: "Kunde inte hämta filmer för administration" });
  }
});

// POST: Skapa en ny film med uppladdning för poster och miniatyrbild
router.post(
  "/",
  upload.fields([
    { name: "posterImage", maxCount: 1 },
    { name: "posterThumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        productionYear,
        release_date,
        end_date,
        ageRating,
        duration,
        shortDescription,
        longDescription,
        categories,
        language,
        trailerUrl,
        director_id,
      } = req.body;

      if (!title) {
        removeUploaded(req.files);
        return res.status(400).json({ error: "Titel är obligatorisk" });
      }

      const movieId = randomUUID();
      // Kategorierna skickas som en strängifierad array via FormData från React
      const categoryIds = categories ? JSON.parse(categories) : [];

      const newMovie = {
        id: movieId,
        title,
        productionYear: productionYear ? Number(productionYear) : null,
        release_date: release_date || null,
        end_date: end_date || null,
        ageRating: ageRating || null,
        duration: duration ? Number(duration) : null,
        shortDescription: shortDescription || null,
        longDescription: longDescription || null,
        language: parseLanguage(language) ?? null,
        trailerUrl: trailerUrl?.trim() || null,
        director_id: director_id || null,
        posterImage: req.files?.posterImage
          ? POSTER_URL + req.files.posterImage[0].filename
          : null,
        posterThumbnail: req.files?.posterThumbnail
          ? THUMB_URL + req.files.posterThumbnail[0].filename
          : null,
      };

      await createMovie(newMovie, categoryIds);
      res
        .status(201)
        .json({ message: "Film skapad framgångsrikt!", movie: newMovie });
    } catch (err) {
      // Sparandet misslyckades – ta bort filerna som redan skrivits till disk
      removeUploaded(req.files);
      console.error("Fel vid skapande av film:", err);
      res.status(500).json({ error: "Kunde inte skapa filmen" });
    }
  },
);

// PUT: Uppdatera en film och dess kategorier
router.put(
  "/:id",
  upload.fields([
    { name: "posterImage", maxCount: 1 },
    { name: "posterThumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        productionYear,
        release_date,
        end_date,
        ageRating,
        duration,
        shortDescription,
        longDescription,
        categories,
        language,
        trailerUrl,
        director_id,
      } = req.body;

      const [existing] = await db.query("SELECT * FROM movies WHERE id = ?", [
        id,
      ]);
      if (existing.length === 0) {
        removeUploaded(req.files);
        return res.status(404).json({ error: "Filmen hittades inte" });
      }
      const currentMovie = existing[0];

      // Skickas inte "categories" alls lämnas filmens kategorier orörda (null).
      // Skickas en tom lista ("[]") tas alla kategorier bort.
      const categoryIds =
        categories !== undefined ? JSON.parse(categories) : null;

      const parsedLanguage = parseLanguage(language);

      const updateData = {
        title: title || currentMovie.title,
        productionYear:
          productionYear !== undefined
            ? productionYear
              ? Number(productionYear)
              : null
            : currentMovie.productionYear,
        release_date:
          release_date !== undefined
            ? release_date || null
            : currentMovie.release_date,
        end_date:
          end_date !== undefined ? end_date || null : currentMovie.end_date,
        ageRating: ageRating !== undefined ? ageRating : currentMovie.ageRating,
        duration:
          duration !== undefined
            ? duration
              ? Number(duration)
              : null
            : currentMovie.duration,
        shortDescription:
          shortDescription !== undefined
            ? shortDescription
            : currentMovie.shortDescription,
        longDescription:
          longDescription !== undefined
            ? longDescription
            : currentMovie.longDescription,
        language:
          parsedLanguage !== undefined
            ? parsedLanguage
            : toJsonValue(currentMovie.language),
        trailerUrl:
          trailerUrl !== undefined
            ? trailerUrl.trim() || null
            : currentMovie.trailerUrl,
        director_id:
          director_id !== undefined
            ? director_id || null
            : currentMovie.director_id,
        posterImage: req.files?.posterImage
          ? POSTER_URL + req.files.posterImage[0].filename
          : currentMovie.posterImage,
        posterThumbnail: req.files?.posterThumbnail
          ? THUMB_URL + req.files.posterThumbnail[0].filename
          : currentMovie.posterThumbnail,
      };

      await updateMovie(id, updateData, categoryIds);

      // Uppdateringen lyckades – ta bort de gamla bilderna som ersatts
      if (req.files?.posterImage && currentMovie.posterImage) {
        removeFile(
          path.join(BASE_DIR, path.basename(currentMovie.posterImage)),
        );
      }
      if (req.files?.posterThumbnail && currentMovie.posterThumbnail) {
        removeFile(
          path.join(THUMB_DIR, path.basename(currentMovie.posterThumbnail)),
        );
      }

      res.json({ message: "Filmen har uppdaterats framgångsrikt!" });
    } catch (err) {
      // Uppdateringen misslyckades – ta bort de nya filerna
      removeUploaded(req.files);
      console.error("Fel vid uppdatering av film:", err);
      res.status(500).json({ error: "Kunde inte uppdatera filmen" });
    }
  },
);

// DELETE: Radera en film (och dess bilder)
router.delete("/:id", async (req, res) => {
  try {
    // Hämta bildnamnen innan filmen raderas
    const [rows] = await db.query(
      "SELECT posterImage, posterThumbnail FROM movies WHERE id = ?",
      [req.params.id],
    );

    const deleted = await deleteMovie(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Filmen hittades inte" });
    }

    if (rows[0]?.posterImage) {
      removeFile(path.join(BASE_DIR, path.basename(rows[0].posterImage)));
    }
    if (rows[0]?.posterThumbnail) {
      removeFile(path.join(THUMB_DIR, path.basename(rows[0].posterThumbnail)));
    }

    res.json({ message: "Filmen har raderats från databasen." });
  } catch (err) {
    console.error("Fel vid radering av film:", err);
    res.status(500).json({ error: "Kunde inte radera filmen" });
  }
});

// =========================================================================
// 2. BEFINTLIGA ANVÄNDAR- & SÖKÄNDPUNKTER
// =========================================================================

// GET: Hämta alla filmer med valfria filter för åldersgräns, kategorier och sökord
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
    res.status(500).json({ error: "Kunde inte hämta filmerna" });
  }
});

// PUT: Sätt eller uppdatera regissör för en film
router.put("/:id/director", async (req, res) => {
  const movieId = req.params.id;
  const { director_id } = req.body;

  try {
    await db.query("UPDATE movies SET director_id = ? WHERE id = ?", [
      director_id || null,
      movieId,
    ]);
    res.json({ message: "Regissör har uppdaterats för filmen." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte spara regissör." });
  }
});

// POST: Lägg till en skådespelare i filmens rollista (movie_cast)
router.post("/:id/cast", async (req, res) => {
  const movieId = req.params.id;
  const { person_id, character_name } = req.body;

  if (!person_id) {
    return res.status(400).json({ error: "person_id är obligatoriskt." });
  }

  try {
    await db.query(
      "INSERT INTO movie_cast (movie_id, person_id, character_name) VALUES (?, ?, ?)",
      [movieId, person_id, character_name || null],
    );
    res
      .status(201)
      .json({ message: "Skådespelare har lagts till i rollistan." });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "Denna person finns redan i filmens rollista." });
    }
    res.status(500).json({ error: "Kunde inte lägga till i rollistan." });
  }
});

// GET: Filtrera på filmstatus (latest, current, upcoming, past)
router.get("/type/:filter", async (req, res, next) => {
  const { filter } = req.params;

  const validFilters = ["latest", "current", "upcoming", "past"];
  if (!validFilters.includes(filter)) {
    return next();
  }

  try {
    const statusParam =
      filter === "latest" || filter === "current" ? "current" : filter;

    const movies = await getMovies({ status: statusParam, limit: 15 });
    res.status(200).json(movies);
  } catch (error) {
    console.error(`GET /movies/type/${filter}:`, error.message);
    return res.status(500).json({
      error: `Kunde inte hämta filmer med status ${filter} från databasen.`,
    });
  }
});

// GET: Hämta en specifik film via ID med fullständig rollista och regissörsinfo
router.get("/:id", async (req, res) => {
  const movieId = req.params.id;

  try {
    const [results] = await db.query(
      `SELECT
        m.*,
        ${CATEGORIES_SUBQUERY},
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', p.id,
                'name', p.name,
                'image', p.image,
                'character_name', mc.character_name
              )
            )
            FROM movie_cast mc
            JOIN persons p ON p.id = mc.person_id
            WHERE mc.movie_id = m.id
          ),
          JSON_ARRAY()
        ) AS \`cast\`,
        (
          SELECT JSON_OBJECT(
            'id', director.id,
            'name', director.name,
            'image', director.image
          )
          FROM persons director
          WHERE director.id = m.director_id
        ) AS director
      FROM movies m
      WHERE m.id = ?`,
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
