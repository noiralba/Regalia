const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./db");
const apiRoutes = require("./routes/api");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api", apiRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "Regalia API fungerar" });
});

async function testDbConnection() {
  try {
    const [rows] = await db.query("SELECT NOW() AS now");

    console.log("Databasanslutning fungerar:", rows[0].now);
  } catch (error) {
    console.error("Databasanslutning misslyckades:", error.message);
  }
}

testDbConnection();

app.listen(port, () => {
  console.log(`Backend kör på http://localhost:${port}`);
});
