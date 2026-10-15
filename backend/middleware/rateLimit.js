const { rateLimit } = require("express-rate-limit");

// Begränsar hur ofta någon kan försöka logga in
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "För många inloggningsförsök. Vänta en stund och försök igen.",
  },
});

// Begränsar hur ofta nya konton kan skapas
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "För många registreringsförsök. Vänta en stund och försök igen.",
  },
});

module.exports = { loginLimiter, registerLimiter };
