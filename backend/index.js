const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./db");
const apiRoutes = require("./routes/api");
const path = require("node:path");

const app = express();
const port = process.env.PORT || 3000;

// dist ligger i repots frontend-mapp, en nivå ovanför backend-mappen
const distFolder = path.join(__dirname, "..", "frontend", "dist");

app.use(
  cors({
    origin: [
      "https://bioregalia.se",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4173",
      "http://192.168.68.125:5173",
      "http://192.168.68.125:4173",
    ],
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
    console.error("Databasanslutning misslyckades:", error.code, error.message);
    console.error(error);
  }
}

testDbConnection();

app.use(express.static(distFolder));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(distFolder, "index.html"));
});

app.listen(port, () => {
  console.log(`Backend kör på http://localhost:${port}`);
});
