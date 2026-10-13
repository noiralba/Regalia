require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const TABLES = [
  "persons",
  "categories",
  "movies",
  "movie_cast",
  "movie_categories",
  "screens",
  "seats",
  "shows",
  "ticket_types",
  "users",
  "bookings",
  "booked_seats",
];

function loadRows(tableName) {
  const filePath = path.join(__dirname, `${tableName}.json`);
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData);
}

async function runSeeder() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    for (const table of TABLES) {
      const rows = loadRows(table);

      for (const row of rows) {
        for (const key in row) {
          if (row[key] !== null && typeof row[key] === "object") {
            row[key] = JSON.stringify(row[key]);
          }
        }
        await db.query(`INSERT INTO \`${table}\` SET ?`, row);
      }
    }
  } catch (error) {
    console.error("Ett fel uppstod. Processen avbröts.");
    console.error("Felmeddelande:", error.message);
  } finally {
    await db.end();
  }
}
runSeeder();
