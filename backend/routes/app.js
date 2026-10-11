const express = require("express");
const router = express.Router();
const seatsRoutes = require("./seats");
// Här kopplar vi in våra routes

router.use("/seats", seatsRoutes);

module.exports = router;
