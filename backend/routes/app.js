const express = require("express");
const router = express.Router();

const screenRoutes = require("./screens");
// Här kopplar vi in våra routes
router.use("/screens", screenRoutes);
module.exports = router;
