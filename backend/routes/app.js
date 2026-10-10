const express = require("express");
const router = express.Router();

const showsRoutes = require("./shows");
const bookingsRoutes = require("./bookings");

router.use("/shows", showsRoutes);
router.use("/bookings", bookingsRoutes);

module.exports = router;
