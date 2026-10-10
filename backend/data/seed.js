require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })
  .promise();

async function seedDatabase() {
  try {
    const filePath = path.join(__dirname, "movies.json");
    const rawData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(rawData);

    if (data.persons) {
      for (const person of data.persons) {
        const [exists] = await pool.query(
          "SELECT id FROM persons WHERE id = ?",
          [person.id],
        );
        if (exists.length === 0) {
          await pool.query(
            "INSERT INTO persons (id, name, image) VALUES (?, ?, ?)",
            [person.id, person.name, person.image],
          );
        }
      }
    }

    if (data.categories) {
      for (const category of data.categories) {
        const [exists] = await pool.query(
          "SELECT id FROM categories WHERE id = ?",
          [category.id],
        );
        if (exists.length === 0) {
          await pool.query("INSERT INTO categories (id, name) VALUES (?, ?)", [
            category.id,
            category.name,
          ]);
        }
      }
    }

    if (data.movies) {
      for (const movie of data.movies) {
        const [exists] = await pool.query(
          "SELECT id FROM movies WHERE id = ?",
          [movie.id],
        );
        if (exists.length === 0) {
          const sql = `
            INSERT INTO movies (
              id, title, productionYear, ageRating, duration, 
              language, posterImage, trailerUrl, shortDescription, 
              longDescription, director_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          // Gör om language-objektet till en JSON-sträng för MySQL-kolumn
          const languageJson = JSON.stringify(movie.language);

          await pool.query(sql, [
            movie.id,
            movie.title,
            movie.productionYear,
            movie.ageRating,
            movie.duration,
            languageJson,
            movie.posterImage,
            movie.trailerUrl,
            movie.shortDescription,
            movie.longDescription,
            movie.director_id,
          ]);
        }
      }
    }

    if (data.movie_categories) {
      for (const mc of data.movie_categories) {
        const [exists] = await pool.query(
          "SELECT * FROM movie_categories WHERE movie_id = ? AND category_id = ?",
          [mc.movie_id, mc.category_id],
        );
        if (exists.length === 0) {
          await pool.query(
            "INSERT INTO movie_categories (movie_id, category_id) VALUES (?, ?)",
            [mc.movie_id, mc.category_id],
          );
        }
      }
    }

    if (data.movie_cast) {
      for (const cast of data.movie_cast) {
        const [exists] = await pool.query(
          "SELECT * FROM movie_cast WHERE movie_id = ? AND person_id = ?",
          [cast.movie_id, cast.person_id],
        );
        if (exists.length === 0) {
          await pool.query(
            "INSERT INTO movie_cast (movie_id, person_id, character_name) VALUES (?, ?, ?)",
            [cast.movie_id, cast.person_id, cast.character_name],
          );
        }
      }
    }
  } catch (error) {
    console.error("Ett fel uppstod under seedningen:", error);
  } finally {
    await pool.end();
  }
}

seedDatabase();
