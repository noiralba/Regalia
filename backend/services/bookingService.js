// service for booking-related operations
const db = require("../db");

async function getBookingConfirmation(bookingNumber) {
  // GET: booking confirmation by booking number
  const [bookings] = await db.query(
    `SELECT id, user_email, booking_number, created_at
     FROM bookings
     WHERE booking_number = ?`,
    [bookingNumber]
  );
  if (bookings.length === 0) return null;
  const { id: bookingId, ...booking } = bookings[0];

  // GET: booked seats for the booking
  const [seats] = await db.query(
    `SELECT bs.show_id, se.seat_row, se.seat_number,
            tt.name AS ticket_type, tt.price
     FROM booked_seats bs
     JOIN seats se        ON se.id = bs.seat_id
     JOIN ticket_types tt ON tt.id = bs.ticket_type_id
     WHERE bs.booking_id = ?
     ORDER BY se.seat_row, se.seat_number`,
    [bookingId]
  );

  // GET: show details for the booked seats
  let show = null;
  if (seats.length > 0) {
    const [shows] = await db.query(
      `SELECT DATE_FORMAT(s.date, '%Y-%m-%d') AS date,
              s.time,
              sc.name AS screen_name,
              m.title, m.ageRating, m.posterImage
              FROM shows s
              JOIN movies m    ON m.id = s.movie_id
              JOIN screens sc ON sc.id = s.screen_id
              WHERE s.id = ?`,
      [seats[0].show_id]
    );
    show = shows[0] ?? null;
  }

  // GET: ticket details for the booked seats
  const tickets = seats.map(({ show_id, ...ticket }) => ({
    ...ticket,
    price: Number(ticket.price),
  }));
  const totalPrice = tickets.reduce((sum, t) => sum + t.price, 0);

  return { ...booking, show, tickets, totalPrice };
}

module.exports = { getBookingConfirmation };