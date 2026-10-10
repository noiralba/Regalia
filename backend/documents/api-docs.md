# Regalia API – Documentaion

Follow this examples and document all the respones for CRUD!

Base-URL: `http://localhost:3000`

# Movies

### GET /movies

Get all the movies from database.

**Respons:** `200 OK`

```json
//An example of how you can document an endpoint

{
  "id": "bb058c9e-8e1c-5458-a144-b2c1a34d4940",
  "title": "The Odyssey",
  "productionYear": 2026,
  "ageRating": 11,
  "duration": 180,
  "language": {
    "original": "Engelska",
    "subtitles": "Svenska"
  },
  "posterImage": "https://cdng.europosters.eu/pod_public/1300/321147.jpg",
  "trailerUrl": "https://www.youtube.com/watch?v=Mzw2ttJD2qQ",
  "shortDescription": "Odysseus ger sig ut på en lång och farofylld resa hem efter det trojanska kriget, där han möter gudar, monster och andra prövningar.",
  "longDescription": "Efter det trojanska kriget försöker kung Odysseus återvända hem till Ithaka och sin familj. Resan blir ett episkt äventyr fyllt av faror, mytiska varelser, mäktiga gudar och svåra val. Samtidigt väntar hans hustru Penelope och sonen Telemachos hemma på hans återkomst.",
  "director_id": "bab4795d-c38e-51c4-a013-f931be094a4c"
}
```

**Fel:** `404 Not Found`

```json
//An example of how to document 404-respons

{
  "fel": "Filmen hittades inte"
}
```

# Screen

### GET /screens

Get all the screens from database.

**Respons:** `200 OK`

```json
[
  {
    "id": "screen-1",
    "name": "Stora Salongen",
    "capacity": 81
  },
  {
    "id": "screen-2",
    "name": "Lilla Salongen",
    "capacity": 45
  }
]
```

**Fel:** `500 Internal Server Error `

```json
{
  "error": "Kunde inte hämta salonger från databasen"
}
```
