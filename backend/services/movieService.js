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

module.exports = { getMovies };
