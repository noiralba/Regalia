// service for booking-related operations
const db = require("../db");

async function getBookingConfirmation(bookingNumber) {
  const [bookings] = await db.query(
    "SELECT id, user_email, booking_number, created_at FROM bookings WHERE booking_number = ?",
    [bookingNumber]
  );
  if (bookings.length === 0) return null;

  // const [bookedSeats] = await db.query(
  //   "SELECT seat_id FROM bookedSeats WHERE booking_id = ?",
  //   [bookings[0].id]
  // );
  // bookings[0].bookedSeats = bookedSeats.map(seat => seat.seat_number);

  // const [shows] = await db.query(
  //   "SELECT s.id, s.movie_id, s.screen_id, s.show_date, s.show_time, m.title FROM shows s JOIN movies m ON s.movie_id = m.id WHERE s.id = (SELECT shows_id FROM bookings WHERE booking_number = ?)",
  //   [bookingNumber]
  // );
  // bookings[0].show = shows[0];
  return bookings[0];
}

module.exports = { getBookingConfirmation };