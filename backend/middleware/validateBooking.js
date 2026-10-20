const validateBooking = (req, res, next) => {
  const { user_email, show_id, seats } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !user_email ||
    !emailRegex.test(user_email) ||
    !show_id ||
    !Array.isArray(seats) ||
    seats.length === 0
  ) {
    return res.status(400).json({
      error: "A valid user_email, show_id and at least one seat are required.",
    });
  }

  if (seats.some((seat) => !seat.seat_id || !seat.ticket_type_id)) {
    return res.status(400).json({
      error: "Every seat must have seat_id and ticket_type_id.",
    });
  }

  next();
};

module.exports = validateBooking;
