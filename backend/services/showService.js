const db = require("../db");

const CLEANING_BUFFER_MIN = 15; // städtid mellan visningar i samma salong
const DEFAULT_DURATION_MIN = 120; // används om filmen saknar längd

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
  const whereClauses = [
    "STR_TO_DATE(CONCAT(`Screening Date`, ' ', `Start Time`), '%Y-%m-%d %H:%i') >= NOW()",
  ];

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

async function createShow(showData, targetDb = db) {
  await targetDb.query("INSERT INTO `shows` SET ?", showData);

  return showData;
}

// =========================================================================
// ADMIN
// =========================================================================

/**
 * ALLA visningar (även tidigare) för admin-listan.
 * Datum och tid formateras i databasen, så ingen tidszonsförskjutning uppstår.
 */
async function getAllShowsAdmin(targetDb = db) {
  const [shows] = await targetDb.query(
    `SELECT sh.id, sh.movie_id, sh.screen_id,
       DATE_FORMAT(sh.date, '%Y-%m-%d') AS date,
       TIME_FORMAT(sh.time, '%H:%i') AS time,
       m.title AS movie_title,
       sc.name AS screen_name,
       sc.capacity,
       (SELECT COUNT(*) FROM booked_seats bs WHERE bs.show_id = sh.id) AS booked_count
     FROM shows sh
     JOIN movies m ON m.id = sh.movie_id
     JOIN screens sc ON sc.id = sh.screen_id
     ORDER BY sh.date DESC, sh.time DESC`,
  );
  return shows;
}

async function getShowAdminById(id, targetDb = db) {
  const [rows] = await targetDb.query(
    `SELECT sh.id, sh.movie_id, sh.screen_id,
       DATE_FORMAT(sh.date, '%Y-%m-%d') AS date,
       TIME_FORMAT(sh.time, '%H:%i') AS time,
       (SELECT COUNT(*) FROM booked_seats bs WHERE bs.show_id = sh.id) AS booked_count
     FROM shows sh
     WHERE sh.id = ?`,
    [id],
  );
  return rows[0] || null;
}

async function updateShow(id, updateData, targetDb = db) {
  await targetDb.query("UPDATE shows SET ? WHERE id = ?", [updateData, id]);
  return { id, ...updateData };
}

/**
 * Radera en visning. Visningar med bokade platser raderas INTE, eftersom
 * booked_seats annars raderas i kedja och kunderna förlorar sina platser.
 */
async function deleteShow(id, targetDb = db) {
  const [[{ bookedCount }]] = await targetDb.query(
    "SELECT COUNT(*) AS bookedCount FROM booked_seats WHERE show_id = ?",
    [id],
  );
  if (bookedCount > 0) return { deleted: false, bookedCount };

  const [result] = await targetDb.query("DELETE FROM shows WHERE id = ?", [id]);
  return { deleted: result.affectedRows > 0, bookedCount: 0 };
}

function toMinutes(time) {
  const [h, m] = String(time).split(":");
  return Number(h) * 60 + Number(m);
}

/**
 * Hittar en annan visning i samma salong samma dag som överlappar
 * (filmens längd + städtid). Returnerar den krockande visningen eller null.
 */
async function findScheduleConflict(
  { screen_id, movie_id, date, time },
  excludeId = "",
  targetDb = db,
) {
  const [[movie]] = await targetDb.query(
    "SELECT duration FROM movies WHERE id = ?",
    [movie_id],
  );
  const [others] = await targetDb.query(
    `SELECT sh.id, TIME_FORMAT(sh.time, '%H:%i') AS time, m.title, m.duration
     FROM shows sh
     JOIN movies m ON m.id = sh.movie_id
     WHERE sh.screen_id = ? AND sh.date = ? AND sh.id <> ?`,
    [screen_id, date, excludeId],
  );

  const start = toMinutes(time);
  const end =
    start + (movie?.duration || DEFAULT_DURATION_MIN) + CLEANING_BUFFER_MIN;

  for (const other of others) {
    const otherStart = toMinutes(other.time);
    const otherEnd =
      otherStart +
      (other.duration || DEFAULT_DURATION_MIN) +
      CLEANING_BUFFER_MIN;
    if (start < otherEnd && otherStart < end) return other;
  }
  return null;
}

module.exports = {
  getMovieScreenings,
  createShow,
  getAllShowsAdmin,
  getShowAdminById,
  updateShow,
  deleteShow,
  findScheduleConflict,
};
