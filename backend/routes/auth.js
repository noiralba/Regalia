const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { loginLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({
      error: "E-postadress och lösenord måste anges.",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing.");
    return res.status(500).json({
      error: "Ett serverfel uppstod. Försök igen senare.",
    });
  }

  try {
    const [users] = await db.execute(
      "SELECT id, password FROM users WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()],
    );

    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: "Felaktig e-postadress eller lösenord.",
      });
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
      issuer: "regalia",
      audience: "regalia-api",
    });

    return res.status(200).json({
      token,
      tokenType: "Bearer",
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("POST /auth/login:", error.message);

    return res.status(500).json({
      error: "Ett serverfel uppstod. Försök igen senare.",
    });
  }
});

module.exports = router;
