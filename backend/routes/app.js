const express = require("express");
const router = express.Router();

// Här kopplar vi in våra routes
const screenRoutes = require("./screens");
const movieRoutes = require("./movieRoutes.js");
const showsRoutes = require("./shows");
const bookingsRoutes = require("./bookings");

router.use("/screens", screenRoutes);
router.use("/movies", movieRoutes);
router.use("/shows", showsRoutes);
router.use("/bookings", bookingsRoutes);

module.exports = router;
