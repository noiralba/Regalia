require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

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
  if (["shows", "bookings", "booked_seats"].includes(tableName)) return [];

  const filePath = path.join(__dirname, `${tableName}.json`);
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData);
}

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function generate84Shows(movies, screens) {
  const shows = [];
  const showTimes = ["15:00:00", "18:00:00", "21:00:00"];
  let currentDate = new Date();

  for (let day = 0; day < 28; day++) {
    const dateString = formatDate(currentDate);

    for (let t = 0; t < 3; t++) {
      const movie = movies[(day * 3 + t) % movies.length];
      const screen = screens[(day * 3 + t) % screens.length];

      shows.push({
        id: uuidv4(),
        movie_id: movie.id,
        screen_id: screen.id,
        date: dateString,
        time: showTimes[t],
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return shows;
}

function generateBookingsAndSeats(shows, users, seats, ticketTypes) {
  const bookings = [];
  const booked_seats = [];

  for (const show of shows) {
    const availableSeats = seats.filter((s) => s.screen_id === show.screen_id);
    if (availableSeats.length === 0) continue;

    const seatsToBookCount = Math.floor(Math.random() * 5) + 2;
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomTicketType =
      ticketTypes[Math.floor(Math.random() * ticketTypes.length)];

    const bookingId = uuidv4();
    const randomBookingNumber =
      "BK-" + Math.floor(100000 + Math.random() * 900000);

    bookings.push({
      id: bookingId,
      user_id: randomUser.id,
      user_email: randomUser.email,
      booking_number: randomBookingNumber,
    });

    for (
      let i = 0;
      i < Math.min(seatsToBookCount, availableSeats.length);
      i++
    ) {
      booked_seats.push({
        id: uuidv4(),
        booking_id: bookingId,
        show_id: show.id,
        seat_id: availableSeats[i].id,
        ticket_type_id: randomTicketType.id,
      });
    }
  }

  return { bookings, booked_seats };
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
    let cachedData = {
      movies: [],
      screens: [],
      seats: [],
      users: [],
      ticket_types: [],
      shows: [],
      bookings: [],
      booked_seats: [],
    };

    for (const table of TABLES) {
      let rows = loadRows(table);

      if (table === "movies") cachedData.movies = rows;
      if (table === "screens") cachedData.screens = rows;
      if (table === "seats") cachedData.seats = rows;
      if (table === "users") cachedData.users = rows;
      if (table === "ticket_types") cachedData.ticket_types = rows;

      if (table === "shows") {
        rows = generate84Shows(cachedData.movies, cachedData.screens);
        cachedData.shows = rows;
      }

      if (table === "bookings" || table === "booked_seats") {
        if (cachedData.bookings.length === 0) {
          const generated = generateBookingsAndSeats(
            cachedData.shows,
            cachedData.users,
            cachedData.seats,
            cachedData.ticket_types,
          );
          cachedData.bookings = generated.bookings;
          cachedData.booked_seats = generated.booked_seats;
        }
        rows = cachedData[table];
      }

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
    console.error("Felmeddelande:", error.message);
  } finally {
    await db.end();
  }
}

runSeeder();
