const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [shows] = await db.query("SELECT * FROM shows");
    res.status(200).json(shows);
  } catch (error) {
    console.error("GET /shows:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

//här måste jag till en getbyid
// sen kalla på den
module.exports = router;
