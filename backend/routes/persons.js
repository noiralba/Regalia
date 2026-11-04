// backend/routes/persons.js
const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getAllPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
} = require("../services/personService");

// =========================================================================
// FILHANTERING (multer + hjälpfunktioner för städning)
// =========================================================================

// Filerna sparas i frontend/src/assets/images/people
const IMAGE_DIR = path.join(
  __dirname,
  "../../frontend/src/assets/images/people",
);

// URL-prefix som sparas i databasen (samma format som i seed-datan)
const IMAGE_URL = "/images/people/";

// Skapa mappen om den saknas
fs.mkdirSync(IMAGE_DIR, { recursive: true });

// Ta bort en fil utan att krascha om den redan är borta
function removeFile(fullPath) {
  fs.unlink(fullPath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Kunde inte ta bort fil:", fullPath, err);
    }
  });
}

// Ta bort filen som multer nyss sparade (används när något går fel)
function removeUploaded(file) {
  if (file) removeFile(file.path);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, IMAGE_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e4);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Endast bildfiler är tillåtna!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// =========================================================================
// ROUTES
// =========================================================================

router.get("/", async (req, res) => {
  try {
    const persons = await getAllPersons();
    res.status(200).json(persons);
  } catch (error) {
    console.error("GET /persons:", error.message);
    res
      .status(500)
      .json({ error: "Kunde inte hämta personer från databasen." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const person = await getPersonById(id);
    if (!person) {
      return res.status(404).json({ error: "Personen hittades inte." });
    }
    res.status(200).json(person);
  } catch (error) {
    console.error("GET /persons/:id:", error.message);
    res.status(500).json({ error: "Serverfel vid hämtning av person." });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { name, bio } = req.body;

  if (!name || name.trim() === "") {
    removeUploaded(req.file);
    return res.status(400).json({ error: "Namn är obligatoriskt." });
  }

  try {
    const newPerson = {
      id: randomUUID(),
      name: name.trim(),
      bio: bio || null,
      image: req.file ? IMAGE_URL + req.file.filename : null,
    };

    await createPerson(newPerson);

    res.status(201).json({
      message: "Personen har lagts till framgångsrikt.",
      person: newPerson,
    });
  } catch (error) {
    // Sparandet misslyckades – ta bort bilden som redan skrivits till disk
    removeUploaded(req.file);
    console.error("POST /persons:", error.message);
    res.status(500).json({ error: "Kunde inte spara personen i databasen." });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;

  try {
    const existingPerson = await getPersonById(id);
    if (!existingPerson) {
      removeUploaded(req.file);
      return res.status(404).json({ error: "Personen hittades inte." });
    }

    const updateData = {
      name: name !== undefined ? name.trim() : existingPerson.name,
      bio: bio !== undefined ? bio : existingPerson.bio,
      image: req.file ? IMAGE_URL + req.file.filename : existingPerson.image,
    };

    if (updateData.name === "") {
      removeUploaded(req.file);
      return res.status(400).json({ error: "Namn kan inte lämnas tomt." });
    }

    await updatePerson(id, updateData);

    // Uppdateringen lyckades – ta bort den gamla bilden som ersatts
    if (req.file && existingPerson.image) {
      removeFile(path.join(IMAGE_DIR, path.basename(existingPerson.image)));
    }

    res.status(200).json({
      message: "Personen har uppdaterats.",
      person: { id, ...updateData },
    });
  } catch (error) {
    // Uppdateringen misslyckades – ta bort den nya bilden
    removeUploaded(req.file);
    console.error("PUT /persons/:id:", error.message);
    res.status(500).json({ error: "Kunde inte uppdatera personen." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Hämta bildnamnet innan personen raderas
    const existingPerson = await getPersonById(id);

    const deleted = await deletePerson(id);
    if (!deleted) {
      return res.status(404).json({ error: "Personen hittades inte." });
    }

    // Ta bara bort bilden om raderingen lyckades
    if (existingPerson?.image) {
      removeFile(path.join(IMAGE_DIR, path.basename(existingPerson.image)));
    }

    res.status(200).json({ message: "Personen har raderats från databasen." });
  } catch (error) {
    console.error("DELETE /persons/:id:", error.message);

    if (
      error.code === "ER_ROW_IS_REFERENCED_2" ||
      error.code === "ER_ROW_IS_REFERENCED"
    ) {
      return res.status(400).json({
        error:
          "Kan inte radera personen eftersom den är länkad som regissör till en film.",
      });
    }
    res.status(500).json({ error: "Ett serverfel inträffade vid radering." });
  }
});

module.exports = router;
