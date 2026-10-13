const express = require("express");
const router = express.Router();
const seatsRoutes = require("./seats");
// Här kopplar vi in våra routes
const screenRoutes = require("./screens");
const movieRoutes = require("./movies");
const showsRoutes = require("./shows");
const bookingsRoutes = require("./bookings");
const usersRoutes = require("./users");

router.use("/screens", screenRoutes);
router.use("/movies", movieRoutes);
router.use("/shows", showsRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/seats", seatsRoutes);
router.use("/users", usersRoutes);

module.exports = router;
