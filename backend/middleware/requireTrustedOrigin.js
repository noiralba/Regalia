function requireTrustedOrigin(req, res, next) {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  const hasSessionCookie = Boolean(req.cookies?.regalia_session);
  const isAuthRequest =
    req.method === "POST" && ["/auth/login", "/auth/logout"].includes(req.path);

  if (!hasSessionCookie && !isAuthRequest) {
    return next();
  }

  const allowedOrigin =
    process.env.FRONTEND_ORIGIN ||
    (process.env.NODE_ENV === "production"
      ? null
      : [
          "http://localhost:5173",
          "http://localhost:4173",
          "http://192.168.1.163:5173",
          "http://192.168.1.163:4173",
        ]);

  let requestOrigin = req.get("Origin");

  if (!requestOrigin) {
    try {
      requestOrigin = new URL(req.get("Referer")).origin;
    } catch {
      return res.status(403).json({
        error: "Begäran nekad.",
      });
    }
  }

  if (!allowedOrigin.includes(requestOrigin)) {
    return res.status(403).json({
      error: "Begäran nekad.",
    });
  }

  next();
}

module.exports = requireTrustedOrigin;
