const db = require("../db");

async function getMovieScreenings(showId = null, targetDb = db) {
  if (showId) {
    const [shows] = await targetDb.query(
      "SELECT * FROM v_movie_screenings WHERE show_id = ?",
      [showId],
    );
    return shows;
  }

  const [shows] = await targetDb.query("SELECT * FROM v_movie_screenings");
  return shows;
}

module.exports = {
  getMovieScreenings,
};
