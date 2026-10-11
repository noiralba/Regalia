const express = require("express");
const router = express.Router();

const movieRoutes = require("./movieRoutes.js");

// Här kopplar vi in våra routes
router.use("/movies", movieRoutes);

module.exports = router;
