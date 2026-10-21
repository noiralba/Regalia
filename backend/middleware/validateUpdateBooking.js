const validateUpdateBooking = (req, res, next) => {
  const { user_email, seats } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (user_email !== undefined && !emailRegex.test(user_email)) {
    return res
      .status(400)
      .json({ error: "The provided user_email is not valid." });
  }

  if (seats !== undefined) {
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        error: "seats must be an array and contain at least one seat.",
      });
    }
    if (seats.some((seat) => !seat.seat_id || !seat.ticket_type_id)) {
      return res
        .status(400)
        .json({ error: "Every seat must have seat_id and ticket_type_id." });
    }
  }

  next();
};

module.exports = validateUpdateBooking;
