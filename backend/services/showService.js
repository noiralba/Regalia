const db = require("../db");

async function getMovieScreenings(showId = null, filters = {}, targetDb = db) {
  if (showId) {
    const [shows] = await targetDb.query(
      "SELECT * FROM v_movie_screenings WHERE show_id = ?",
      [showId],
    );
    return shows;
  }

  let sql = "SELECT * FROM v_movie_screenings";
  const queryParams = [];
  const whereClauses = [];

  if (filters.date) {
    whereClauses.push("`Screening Date` = ?");
    queryParams.push(filters.date);
  }

  if (filters.movie_id) {
    whereClauses.push("`movie_id` = ?");
    queryParams.push(filters.movie_id);
  }

  if (filters.age_rating) {
    whereClauses.push("`Age Rating` = ?");
    queryParams.push(filters.age_rating);
  }

  if (filters.category) {
    whereClauses.push("`Categories` LIKE ?");
    queryParams.push(`%${filters.category}%`);
  }

  if (whereClauses.length > 0) {
    sql += " WHERE " + whereClauses.join(" AND ");
  }

  sql += " ORDER BY `Screening Date` ASC, `Start Time` ASC";

  const [shows] = await targetDb.query(sql, queryParams);
  return shows;
}

module.exports = { getMovieScreenings };
