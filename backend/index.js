const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Regalia API fungerar" });
});

app.listen(port, () => {
  console.log(`Backend kör på http://localhost:${port}`);
});
