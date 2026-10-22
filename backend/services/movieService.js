const db = require("../db");

async function getMovies({ type = "latest", limit = 15 } = {}, targetDb = db) {
  let sql = "SELECT * FROM movies";

  if (type === "upcoming") {
    sql += " WHERE release_date > NOW() ORDER BY release_date ASC";
  } else {
    sql += " WHERE release_date <= NOW() ORDER BY release_date DESC";
  }

  sql += " LIMIT ?";

  const [movies] = await targetDb.query(sql, [Number(limit)]);
  return movies;
}

module.exports = { getMovies };
