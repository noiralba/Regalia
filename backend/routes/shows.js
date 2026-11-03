const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const {
  getMovieScreenings,
  createShow,
  getAllShowsAdmin,
  getShowAdminById,
  updateShow,
  deleteShow,
  findScheduleConflict,
} = require("../services/showService");

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

function isValidDate(value) {
  if (typeof value !== "string" || !DATE_REGEX.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// Gemensam validering för POST och PUT. Returnerar ett felmeddelande eller null.
function validateShowFields({ movie_id, screen_id, date, time }) {
  if (!movie_id || !screen_id || !date || !time) {
    return "Fälten movie_id, screen_id, date och time är obligatoriska.";
  }
  if (!isValidDate(date)) return "Datum måste anges som ÅÅÅÅ-MM-DD.";
  if (typeof time !== "string" || !TIME_REGEX.test(time)) {
    return "Tid måste anges som TT:MM.";
  }
  return null;
}

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

// ADMIN: Alla visningar, även tidigare, med antal bokade platser.
// Måste ligga före "/:id".
router.get("/admin/all", async (req, res) => {
  try {
    const shows = await getAllShowsAdmin();
    res.status(200).json(shows);
  } catch (error) {
    console.error("GET /shows/admin/all:", error);
    res
      .status(500)
      .json({ error: "Kunde inte hämta visningar för administration." });
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
  const { movie_id, screen_id, date, time } = req.body ?? {};

  const validationError = validateShowFields({
    movie_id,
    screen_id,
    date,
    time,
  });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const conflict = await findScheduleConflict({
      movie_id,
      screen_id,
      date,
      time,
    });
    if (conflict) {
      return res.status(409).json({
        error: `Salongen är upptagen vid den tiden: ${conflict.title} startar ${conflict.time}.`,
      });
    }

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

// PUT: Uppdatera en visning. Fält som inte skickas behåller sitt värde.
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await getShowAdminById(id);
    if (!existing) {
      return res.status(404).json({ error: "Visningen hittades inte." });
    }

    const body = req.body ?? {};
    const updateData = {
      movie_id: body.movie_id ?? existing.movie_id,
      screen_id: body.screen_id ?? existing.screen_id,
      date: body.date ?? existing.date,
      time: body.time ?? existing.time,
    };

    const validationError = validateShowFields(updateData);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Med bokade platser får varken film eller salong bytas, eftersom
    // platserna hör till den ursprungliga salongen. Datum och tid går bra.
    if (
      existing.booked_count > 0 &&
      (updateData.movie_id !== existing.movie_id ||
        updateData.screen_id !== existing.screen_id)
    ) {
      return res.status(409).json({
        error: `Visningen har ${existing.booked_count} bokade platser. Film och salong kan inte ändras, bara datum och tid.`,
      });
    }

    const conflict = await findScheduleConflict(updateData, id);
    if (conflict) {
      return res.status(409).json({
        error: `Salongen är upptagen vid den tiden: ${conflict.title} startar ${conflict.time}.`,
      });
    }

    await updateShow(id, updateData);
    res.status(200).json({ message: "Visningen har uppdaterats." });
  } catch (error) {
    console.error("PUT /shows/:id:", error.message);

    if (
      error.code === "ER_NO_REFERENCED_ROW_2" ||
      error.code === "ER_NO_REFERENCED_ROW"
    ) {
      return res.status(400).json({
        error: "Angivet movie_id eller screen_id existerar inte i databasen.",
      });
    }

    res.status(500).json({ error: "Kunde inte uppdatera visningen." });
  }
});

// DELETE: Radera en visning (blockeras om den har bokade platser)
router.delete("/:id", async (req, res) => {
  try {
    const { deleted, bookedCount } = await deleteShow(req.params.id);

    if (bookedCount > 0) {
      return res.status(409).json({
        error: `Visningen har ${bookedCount} bokade platser och kan inte raderas. Avboka bokningarna först.`,
      });
    }
    if (!deleted) {
      return res.status(404).json({ error: "Visningen hittades inte." });
    }

    res.status(200).json({ message: "Visningen har raderats." });
  } catch (error) {
    console.error("DELETE /shows/:id:", error.message);
    res.status(500).json({ error: "Kunde inte radera visningen." });
  }
});

module.exports = router;
