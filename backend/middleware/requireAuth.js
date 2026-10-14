const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authorization = req.get("Authorization") || "";
  const match = authorization.match(/^Bearer ([^\s]+)$/i);

  // Ingen token? Stoppa anropet.
  if (!match) {
    return res.status(401).json({
      error: "Du behöver logga in.",
    });
  }

  // Kontrollera serverns hemliga nyckel.
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing.");

    return res.status(500).json({
      error: "Ett serverfel uppstod.",
    });
  }

  try {
    // Kontrollera att token är giltig.
    const decoded = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
      issuer: "regalia",
      audience: "regalia-api",
    });

    if (typeof decoded.sub !== "string" || !decoded.sub) {
      return res.status(401).json({
        error: "Ogiltig inloggning.",
      });
    }

    // Spara ID för kommande behörighetskontroller.
    req.user = { id: decoded.sub };

    // Släpp vidare anropet.
    next();
  } catch {
    return res.status(401).json({
      error: "Ogiltig eller utgången inloggning.",
    });
  }
}

module.exports = requireAuth;
