const express = require("express");
const router = express.Router();
const db = require("../db");
const { getMovieScreenings } = require("../services/showService");
const { randomUUID } = require("crypto");
const validateBooking = require("../middleware/validateBooking");
const validateUpdateBooking = require("../middleware/validateUpdateBooking");
const { sendBookingConfirmation } = require("../services/emailService");

async function runInTransaction(res, callback) {
  let connection;
  let isTransactionActive = false;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    isTransactionActive = true;

    const result = await callback(connection);

    await connection.commit();
    return result;
  } catch (error) {
    if (connection && isTransactionActive) {
      try {
        await connection.rollback();
      } catch (e) {
        console.error("Rollback failed:", e);
      }
    }

    console.error("Database transaction error:", error);

    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      return res.status(409).json({
        error:
          "One or more of the selected seats are already booked for this show.",
      });
    }

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        error: error.publicMessage || "Ett oväntat serverfel inträffade.",
      });
    }

    return res
      .status(500)
      .json({ error: "An unexpected server error occurred." });
  } finally {
    if (connection) connection.release();
  }
}

async function getOrderConfirmation(column, value, targetDb = db) {
  const [order] = await targetDb.query(
    `SELECT * FROM v_order_confirmation WHERE \`${column}\` = ?`,
    [value],
  );
  return order;
}

router.get("/", async (req, res) => {
  try {
    const [bookings] = await db.query("SELECT * FROM v_order_confirmation");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("GET /bookings:", error.message);
    return res.status(500).json({
      error: "Could not retrieve bookings from the database.",
    });
  }
});

router.get("/order/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await getOrderConfirmation("Booking Number", id);

    if (order.length === 0) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      error.publicMessage = "Bokning hittades inte.";
      throw error;
    }

    res.status(200).json(order[0]);
  } catch (error) {
    console.error("Fel vid hämtning av order.", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.publicMessage });
    }

    res.status(500).json({ error: "Kunde inte hämta order från databasen." });
  }
});

router.post("/", validateBooking, async (req, res) => {
  const { user_id, user_email, show_id, seats } = req.body;
  const id = randomUUID();
  const booking_number = `REG-${randomUUID()}`;

  await runInTransaction(res, async (connection) => {
    const show = await getMovieScreenings(show_id, connection);

    if (show.length === 0) {
      const error = new Error("Show not found");
      error.statusCode = 404;
      error.publicMessage = "Visning hittades inte.";
      throw error;
    }

    await connection.query(
      `INSERT INTO bookings (id, user_id, user_email, booking_number) VALUES (?, ?, ?, ?)`,
      [id, user_id ?? null, user_email, booking_number],
    );

    for (const seat of seats) {
      await connection.query(
        `INSERT INTO booked_seats (id, booking_id, show_id, seat_id, ticket_type_id) VALUES (?, ?, ?, ?, ?)`,
        [randomUUID(), id, show_id, seat.seat_id, seat.ticket_type_id],
      );
    }

    const order = await getOrderConfirmation(
      "Booking Number",
      booking_number,
      connection,
    );

    if (order.length === 0) {
      const error = new Error("Order generation failed");
      error.statusCode = 500;
      error.publicMessage = "bokningsbekräftelse kunde inte skapas.";
      throw error;
    }

    try {
      if (order.length > 0) {
        await sendBookingConfirmation(user_email, order[0]);
      }
    } catch (emailError) {
      console.error(
        "Kunde inte skicka bokningsbekräftelse via e-post:",
        emailError.message,
      );
    }

    return res.status(201).json(order[0]);
  });
});

router.put("/:id", validateUpdateBooking, async (req, res) => {
  const { id } = req.params; //
  const { user_id, user_email, show_id, seats } = req.body;

  await runInTransaction(res, async (connection) => {
    const [rows] = await connection.query(
      "SELECT user_id, user_email FROM bookings WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      error.publicMessage = "Bokningen hittades inte.";
      throw error;
    }
    const existing = rows[0];

    const finalUserId = user_id !== undefined ? user_id : existing.user_id;
    const finalUserEmail =
      user_email !== undefined ? user_email : existing.user_email;

    await connection.query(
      "UPDATE bookings SET user_id = ?, user_email = ? WHERE id = ?",
      [finalUserId ?? null, finalUserEmail, id],
    );

    if (seats !== undefined) {
      if (!show_id) {
        const error = new Error("Missing show_id");
        error.statusCode = 400;
        error.publicMessage = "show_id krävs vid uppdatering av platser.";
        throw error;
      }

      const show = await getMovieScreenings(show_id, connection);

      if (show.length === 0) {
        const error = new Error("Show not found");
        error.statusCode = 404;
        error.publicMessage = "Visning hittades inte.";
        throw error;
      }

      await connection.query("DELETE FROM booked_seats WHERE booking_id = ?", [
        id,
      ]);

      for (const seat of seats) {
        await connection.query(
          `INSERT INTO booked_seats (id, booking_id, show_id, seat_id, ticket_type_id) VALUES (?, ?, ?, ?, ?)`,
          [randomUUID(), id, show_id, seat.seat_id, seat.ticket_type_id],
        );
      }
    }

    const updatedOrder = await getOrderConfirmation("id", id, connection);

    return res
      .status(200)
      .json(
        updatedOrder.length > 0
          ? updatedOrder[0]
          : { message: "Booking updated successfully." },
      );
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [existingBookings] = await db.query(
      "SELECT id FROM bookings WHERE id = ?",
      [id],
    );

    if (existingBookings.length === 0) {
      const error = new Error("Booking not found");
      error.statusCode = 404;
      error.publicMessage = "Bokningen hittades inte.";
      throw error;
    }

    await db.query("DELETE FROM bookings WHERE id = ?", [id]);

    return res.status(200).json({
      message: "Booking deleted successfully.",
      id,
    });
  } catch (error) {
    console.error("DELETE /bookings/:id:", error.message);

    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.publicMessage });
    }

    return res.status(500).json({
      error: "Server error.",
    });
  }
});

module.exports = router;
