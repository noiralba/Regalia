const express = require("express");
const router = express.Router();

const seatsRoutes = require("./seats");
const screenRoutes = require("./screens");
const movieRoutes = require("./movies");
const showsRoutes = require("./shows");
const ticketTypeRoutes = require("./ticketTypes");
const bookingsRoutes = require("./bookings");
const usersRoutes = require("./users");
const authRoutes = require("./auth");
const themesRoutes = require("./themes");
const personsRouter = require("./persons");
const categoriesRoutes = require("./categories");

router.use("/screens", screenRoutes);
router.use("/movies", movieRoutes);
router.use("/shows", showsRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/ticket-types", ticketTypeRoutes);
router.use("/seats", seatsRoutes);
router.use("/users", usersRoutes);
router.use("/auth", authRoutes);
router.use("/themes", themesRoutes);
router.use("/persons", personsRouter);
router.use("/categories", categoriesRoutes);

module.exports = router;
