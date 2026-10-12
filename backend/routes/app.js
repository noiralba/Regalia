const express = require("express");
const router = express.Router();

const seatsRoutes = require("./seats");
const screenRoutes = require("./screens");
const movieRoutes = require("./movieRoutes.js");
const showsRoutes = require("./shows");
const ticketTypeRoutes = require("./ticketTypes");
const bookingsRoutes = require("./bookings");

router.use("/screens", screenRoutes);
router.use("/movies", movieRoutes);
router.use("/shows", showsRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/ticket-types", ticketTypeRoutes);
router.use("/seats", seatsRoutes);

module.exports = router;
