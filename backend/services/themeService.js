const db = require("../db");
const { randomUUID } = require("crypto");

/**
 * Alla teman (även inaktiva) med antal filmer och film-ID:n,
 * så att admin-formuläret kan förifylla filmlistan vid redigering.
 */
async function getAllThemesAdmin(targetDb = db) {
  const [themes] = await targetDb.query(
    `SELECT t.id, t.name, t.description, t.is_active,
       (SELECT COUNT(*) FROM movie_themes mt WHERE mt.theme_id = t.id) AS movie_count,
       (SELECT COALESCE(JSON_ARRAYAGG(mt.movie_id), JSON_ARRAY())
        FROM movie_themes mt WHERE mt.theme_id = t.id) AS movie_ids
     FROM themes t
     ORDER BY t.name ASC`,
  );
  return themes;
}

async function getThemeById(id, targetDb = db) {
  const [rows] = await targetDb.query(
    "SELECT id, name, description, is_active FROM themes WHERE id = ?",
    [id],
  );
  return rows[0] || null;
}

// Namnet jämförs utan hänsyn till versaler/gemener. excludeId används vid uppdatering.
async function themeNameExists(name, excludeId = "", targetDb = db) {
  const [rows] = await targetDb.query(
    "SELECT id FROM themes WHERE LOWER(name) = LOWER(?) AND id <> ?",
    [name, excludeId],
  );
  return rows.length > 0;
}

async function replaceMovies(connection, themeId, movieIds) {
  await connection.query("DELETE FROM movie_themes WHERE theme_id = ?", [
    themeId,
  ]);
  if (movieIds.length > 0) {
    const values = movieIds.map((movieId) => [movieId, themeId]);
    await connection.query(
      "INSERT INTO movie_themes (movie_id, theme_id) VALUES ?",
      [values],
    );
  }
}

async function createTheme(
  { name, description, is_active },
  movieIds = [],
  targetDb = db,
) {
  const connection = await targetDb.getConnection();
  try {
    await connection.beginTransaction();

    const theme = { id: randomUUID(), name, description, is_active };
    await connection.query("INSERT INTO themes SET ?", theme);
    await replaceMovies(connection, theme.id, movieIds);

    await connection.commit();
    return { ...theme, movie_count: movieIds.length, movie_ids: movieIds };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Uppdatera tema och dess filmer.
 * movieIds === null  => filmkopplingarna lämnas orörda
 * movieIds === []    => alla filmer kopplas bort
 */
async function updateTheme(id, updateData, movieIds = null, targetDb = db) {
  const connection = await targetDb.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query("UPDATE themes SET ? WHERE id = ?", [updateData, id]);
    if (movieIds !== null) {
      await replaceMovies(connection, id, movieIds);
    }

    await connection.commit();
    return { id, ...updateData };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Filmkopplingarna raderas automatiskt (ON DELETE CASCADE). Filmerna påverkas inte.
async function deleteTheme(id, targetDb = db) {
  const [result] = await targetDb.query("DELETE FROM themes WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllThemesAdmin,
  getThemeById,
  themeNameExists,
  createTheme,
  updateTheme,
  deleteTheme,
};
