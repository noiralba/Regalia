const db = require("../db");

async function getMovies(
  { status = "current", limit = 15 } = {},
  targetDb = db,
) {
  let sql = "SELECT * FROM v_homepage_movies";
  const params = [];

  if (status === "upcoming") {
    sql += " WHERE release_date > CURDATE() ORDER BY release_date ASC";
  } else if (status === "past") {
    sql += " WHERE end_date < CURDATE() ORDER BY end_date DESC";
  } else {
    sql +=
      " WHERE release_date <= CURDATE() AND (end_date >= CURDATE() OR end_date IS NULL) ORDER BY release_date DESC";
  }

  sql += " LIMIT ?";
  params.push(Number(limit));

  const [movies] = await targetDb.query(sql, params);
  return movies;
}
/**
 * Hämta ALLA råa filmer för admin-listan, inklusive kategori-ID:n
 * så att admin-formuläret kan förifylla kryssrutorna vid redigering.
 */
async function getAllMoviesAdmin(targetDb = db) {
  const [movies] = await targetDb.query(
    `SELECT m.*,
      (SELECT COALESCE(JSON_ARRAYAGG(mc.category_id), JSON_ARRAY())
       FROM movie_categories mc
       WHERE mc.movie_id = m.id) AS categoryIds
     FROM movies m
     ORDER BY m.title ASC`,
  );
  return movies;
}

/**
 * Skapa en ny film och tillhörande kategorier
 */
async function createMovie(movieData, categoryIds = [], targetDb = db) {
  const connection = await targetDb.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Spara filmen
    await connection.query("INSERT INTO movies SET ?", movieData);

    // 2. Spara kategorikopplingar
    if (categoryIds.length > 0) {
      const values = categoryIds.map((catId) => [movieData.id, catId]);
      await connection.query(
        "INSERT INTO movie_categories (movie_id, category_id) VALUES ?",
        [values],
      );
    }

    await connection.commit();
    return movieData;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Uppdatera film och dess kategorier.
 * categoryIds === null  => kategorierna lämnas orörda
 * categoryIds === []    => alla kategorier tas bort
 */
async function updateMovie(id, updateData, categoryIds = null, targetDb = db) {
  const connection = await targetDb.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Uppdatera filmen
    await connection.query("UPDATE movies SET ? WHERE id = ?", [
      updateData,
      id,
    ]);

    // 2. Uppdatera kategorier (Ta bort gamla, lägg till nya) – bara om de skickats med
    if (categoryIds !== null) {
      await connection.query(
        "DELETE FROM movie_categories WHERE movie_id = ?",
        [id],
      );
      if (categoryIds.length > 0) {
        const values = categoryIds.map((catId) => [id, catId]);
        await connection.query(
          "INSERT INTO movie_categories (movie_id, category_id) VALUES ?",
          [values],
        );
      }
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

/**
 * Radera en film
 */
async function deleteMovie(id, targetDb = db) {
  const [result] = await targetDb.query("DELETE FROM movies WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}

module.exports = {
  getMovies,
  getAllMoviesAdmin,
  createMovie,
  updateMovie,
  deleteMovie,
};
