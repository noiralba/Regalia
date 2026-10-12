const express = require("express");
const router = express.Router();

const showsRoutes = require("./shows");
const bookingsRoutes = require("./bookings");
const movieRoutes = require("./movieRoutes.js");
const usersRoutes = require("./users");

router.use("/shows", showsRoutes);
router.use("/bookings", bookingsRoutes);
router.use("/movies", movieRoutes);
router.use("/users", usersRoutes);

module.exports = router;
