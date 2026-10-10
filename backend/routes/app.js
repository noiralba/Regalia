const express = require("express");
const router = express.Router();

const showsRoutes = require("./shows");

// Här kopplar vi in våra routes
router.use("/shows", showsRoutes);

module.exports = router;
