const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authorization = req.get("Authorization") || "";
  const match = authorization.match(/^Bearer ([^\s]+)$/i);

  const token = match?.[1] ?? req.cookies?.regalia_session;

  if (!token) {
    return res.status(401).json({
      error: "Du behöver logga in.",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing.");

    return res.status(500).json({
      error: "Ett serverfel uppstod.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "regalia",
      audience: "regalia-api",
    });

    if (typeof decoded.sub !== "string" || !decoded.sub) {
      return res.status(401).json({
        error: "Ogiltig inloggning.",
      });
    }

    req.user = { id: decoded.sub };
    req.sessionExpiresAt = decoded.exp * 1000;
    next();
  } catch {
    return res.status(401).json({
      error: "Ogiltig eller utgången inloggning.",
    });
  }
}

module.exports = requireAuth;
