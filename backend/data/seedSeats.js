require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

function loadRows(tableName) {
  const filePath = path.join(__dirname, `${tableName}.json`);
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData);
}

async function runSeatSeeder() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    const rows = loadRows("seats");
    console.log(`Hittade ${rows.length} stolar. Uppdaterar seat_number...`);

    for (const row of rows) {
      if (row.id && row.seat_number !== undefined) {
        await db.query("UPDATE `seats` SET `seat_number` = ? WHERE `id` = ?", [
          row.seat_number,
          row.id,
        ]);
      }
    }

    console.log("Klart! Alla seat_number har uppdaterats.");
  } catch (error) {
    console.error("Ett fel uppstod. Processen avbröts.");
    console.error("Felmeddelande:", error.message);
  } finally {
    await db.end();
  }
}

runSeatSeeder();
