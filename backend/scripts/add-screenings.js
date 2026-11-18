const crypto = require("node:crypto");
const db = require("../db");

const DAYS_AHEAD = 14;
const TIMES = ["12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

async function refillScreenings() {
  const [screens] = await db.query("SELECT id FROM screens");
  if (screens.length === 0) return 0;

  let added = 0;
  const now = new Date();

  for (let day = 0; day < DAYS_AHEAD; day++) {
    const d = new Date();
    d.setDate(d.getDate() + day);
    const dateStr = d.toLocaleDateString("sv-SE"); // YYYY-MM-DD, lokal tid

    // bara filmer som går den här dagen
    const [movies] = await db.query(
      `SELECT id FROM movies
       WHERE release_date <= ? AND (end_date IS NULL OR end_date >= ?)`,
      [dateStr, dateStr],
    );
    if (movies.length === 0) continue;

    for (const [i, screen] of screens.entries()) {
      for (const [j, time] of TIMES.entries()) {
        // hoppa över tider som redan har passerat
        if (new Date(`${dateStr}T${time}:00`) < now) continue;

        // hoppa över om det redan finns en visning i salongen då
        const [existing] = await db.query(
          "SELECT id FROM shows WHERE screen_id = ? AND date = ? AND time = ?",
          [screen.id, dateStr, `${time}:00`],
        );
        if (existing.length > 0) continue;

        // enkel rotation så att alla filmer visas
        const movie = movies[(day + i + j) % movies.length];

        await db.query(
          "INSERT INTO shows (id, movie_id, screen_id, date, time) VALUES (?, ?, ?, ?, ?)",
          [crypto.randomUUID(), movie.id, screen.id, dateStr, `${time}:00`],
        );
        added++;
      }
    }
  }

  return added;
}

module.exports = refillScreenings;

// Körs bara när filen startas direkt: npm run add-screenings
if (require.main === module) {
  refillScreenings()
    .then((n) => {
      console.log(`Lade till ${n} visningar`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}