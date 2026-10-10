const express = require("express");
const router = express.Router();
const db = require("../db");

// GET: Hämta alla bokningar
router.get("/", async (req, res) => {
  try {
    const [bookings] = await db.query("SELECT * FROM bookings");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("GET /bookings:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

// // POST: Skapa en bokning, INTE KLAR, väntar på att alla GET ska bli klara

// router.post("/", async (req, res) => {
//   const { id, user_email, bookedSeats_id, shows_id } = req.body;

//   if (!id || !user_email || !shows_id) {
//     return res.status(400).json({
//       error: "id, user_email and shows_id are required.",
//     });
//   }

//   try {
//     await db.query(
//       `INSERT INTO bookings
//         (id, user_email, bookedSeats_id, shows_id)
//        VALUES (?, ?, ?, ?)`,
//       [id, user_email, bookedSeats_id ?? null, shows_id],
//     );

//     res.status(201).json({
//       id,
//       user_email,
//       bookedSeats_id: bookedSeats_id ?? null,
//       shows_id,
//     });
//   } catch (error) {
//     console.error("POST /bookings:", error.message);
//     res.status(500).json({ error: "Server error." });
//   }
// });

module.exports = router;
