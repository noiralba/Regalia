// service for booking-related operations
const db = require("../db");

async function getBookingConfirmation(bookingNumber) {
  const [bookings] = await db.query(
    "SELECT id, user_email, booking_number, created_at FROM bookings WHERE booking_number = ?",
    [bookingNumber]
  );
  if (bookings.length === 0) return null;

  // här lägger du senare till frågorna för visning, film och stolar
  return bookings[0];
}

module.exports = { getBookingConfirmation };