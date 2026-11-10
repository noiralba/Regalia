const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { loginLimiter } = require("../middleware/rateLimit");
const requireAuth = require("../middleware/requireAuth");

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
      "SELECT id, email, password FROM users WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()],
    );

    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        error: "Felaktig e-postadress eller lösenord.",
      });
    }
    console.log("LOGIN_DEBUG - User från DB:", {
      id: user?.id,
      email: user?.email,
    });

    const token = jwt.sign(
      { sub: user.id, email: user.email, id: user.id },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "1h",
        issuer: "regalia",
        audience: "regalia-api",
      },
    );

    res.cookie("regalia_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // path: "/api",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      expiresIn: 3600,
      userId: user.id,
    });
  } catch (error) {
    console.error("POST /auth/login:", error.message);

    return res.status(500).json({
      error: "Ett serverfel uppstod. Försök igen senare.",
    });
  }
});

router.get("/session", requireAuth, (req, res) => {
  res.set("Cache-Control", "no-store");

  console.log("SESSION_DEBUG - req.user innehåll:", req.user);

  return res.status(200).json({
    authenticated: true,
    expiresAt: req.sessionExpiresAt,
    email: req.user.email,
    id: req.user.id,
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("regalia_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
  });

  return res.sendStatus(204);
});

module.exports = router;
