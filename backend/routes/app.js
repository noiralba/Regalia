const express = require("express");
const router = express.Router();

const showsRoutes = require("./shows");
const bookingsRoutes = require("./bookings");

router.use("/shows", showsRoutes);
router.use("/bookings", bookingsRoutes);
const movieRoutes = require("./movieRoutes.js");

// Här kopplar vi in våra routes
router.use("/movies", movieRoutes);

module.exports = router;
