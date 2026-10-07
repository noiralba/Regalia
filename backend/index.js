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

// Det här är liknar grundupplägget som Express visar i sin "Hello-world"-guide.
// Skapa Express (), definera en route och starta servern med app.listen(...)
// Källa: https://expressjs.com/en/starter/hello-world/
//Maria
