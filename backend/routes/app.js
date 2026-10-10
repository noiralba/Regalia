const express = require("express");
const router = express.Router();

const ticketTypeRoutes = require("./ticketTypes");
// Här kopplar vi in våra routes
router.use("/ticket-types", ticketTypeRoutes);

module.exports = router;
