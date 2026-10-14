function requireOwnUser(req, res, next) {
  // Kontrollera att användaren är inloggad
  if (!req.user?.id) {
    return res.status(401).json({
      error: "Du behöver logga in.",
    });
  }

  // Kontrollera att användaren äger kontot
  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      error: "Du har inte behörighet till det här kontot.",
    });
  }

  // Rätt användare får fortsätta
  next();
}

module.exports = requireOwnUser;
