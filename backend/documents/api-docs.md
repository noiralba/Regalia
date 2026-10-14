# Regalia API – Documentation

Follow this examples and document all the respones for CRUD!

Base-URL: `http://localhost:3000`

# Movies

# Mall

### GET /movies

Get all the movies from database.

**Status:** `200 OK`

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

**Status:** `404 Not Found`

```json
//An example of how to document 404-respons

{
  "error": "Film hittades inte"
}
```

# Regalia API

Base-URL: `http://localhost:3000`

**Status:** `200 OK`

```json
{
  "message": "Regalia API fungerar"
}
```

### GET /movies

**Status:** `200 OK`

```json
[
  {
    "id": "b4685044-a0e4-5836-9e8b-11102d8e1cd5",
    "title": "The Conjuring",
    "productionYear": 2013,
    "ageRating": 15,
    "duration": 112,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/the-conjuring-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=ejMMn0t58Lc",
    "shortDescription": "En klassisk spökhistoria för dig som vågar stanna kvar när lamporna släcks.",
    "longDescription": "Ed och Lorraine Warren hjälper en familj som flyttat in i ett hus där något mörkt och övernaturligt verkar ha vaknat. Se filmen tillsammans med andra skräckälskare under en sen Halloweenvisning.",
    "director_id": "40a9cff9-4eaf-48b0-a054-4fb136ae1dd6",
    "categories": [
      "Övernaturlig",
      "Thriller",
      "Skräck"
    ]
  },
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
    "posterImage": "/images/movies/odyssey-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=Mzw2ttJD2qQ",
    "shortDescription": "Odysseus ger sig ut på en lång och farofylld resa hem efter det trojanska kriget, där han möter gudar, monster och andra prövningar.",
    "longDescription": "Efter det trojanska kriget försöker kung Odysseus återvända hem till Ithaka och sin familj. Resan blir ett episkt äventyr fyllt av faror, mytiska varelser, mäktiga gudar och svåra val. Samtidigt väntar hans hustru Penelope och sonen Telemachos hemma på hans återkomst.",
    "director_id": "bab4795d-c38e-51c4-a013-f931be094a4c",
    "categories": [
      "Äventyr",
      "Drama",
      "Action",
      "Fantasy"
    ]
  },
  {
    "id": "cfacf3cc-ddad-502b-bee8-acb226a67a00",
    "title": "Coraline",
    "productionYear": 2009,
    "ageRating": 11,
    "duration": 100,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/coraline-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=m9bOpeuvNwY",
    "shortDescription": "Coraline upptäcker en annan värld bakom en hemlig dörr – men allt är inte som det verkar.",
    "longDescription": "Coraline upptäcker en hemlig dörr i sitt nya hem som leder till en alternativ värld. Där verkar allt vara bättre än hemma, men snart upptäcker hon att den perfekta världen döljer en mörk hemlighet.",
    "director_id": "0e8f5c3e-9856-4fa7-b187-ea2babe4b8de",
    "categories": [
      "Animerat",
      "Skräck",
      "Fantasy"
    ]
  },
  {
    "id": "ef33e1fe-a3d6-5bc3-807a-44f2ebf55d70",
    "title": "Fjord",
    "productionYear": 2026,
    "ageRating": 11,
    "duration": 146,
    "language": {
      "original": "Norska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/fjord-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=0gdRZZVoinM",
    "shortDescription": "En familj flyttar till Norge för att börja om, men en konflikt med en grannfamilj förändrar allt.",
    "longDescription": "Det rumänsk-norska paret Mihai och Lisbeth flyttar till Norge med sina barn efter att Mihais föräldrar gått bort. De lär känna grannfamiljen Halberg och relationerna blir allt närmare. Men när parets dotter Elia kommer till skolan med blåmärken väcks misstankar och snart hamnar de båda familjerna i en konflikt om uppfostran, tro och frihet.",
    "director_id": "80fc4e70-3109-5b7c-b03e-de1788cce0bc",
    "categories": [
      "Familj",
      "Drama",
      "Thriller"
    ]
  },
  {
    "id": "fdb64c04-c883-5830-b4b7-96efdef437a1",
    "title": "Digger",
    "productionYear": 2026,
    "ageRating": 11,
    "duration": 129,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/digger-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=qORTe1wW3Wg",
    "shortDescription": "En mäktig oljemiljardär försöker övertyga världen om att han är mänsklighetens räddare innan katastrofen han själv orsakat förstör allt.",
    "longDescription": "Digger Rockwell är världens mäktigaste man och en av världens rikaste oljemiljardärer. När en katastrof som han själv har orsakat hotar att förändra världen försöker han desperat övertyga mänskligheten om att han är dess räddare. Filmen är en mörk och satirisk berättelse om makt, girighet, miljökatastrofer och ansvar.",
    "director_id": "98444e80-98ad-5c03-80de-2abd73692930",
    "categories": [
      "Komedi",
      "Drama",
      "Satir"
    ]
  }
]
```

### GET /movies/:id

**Status:** `200 OK`

```json
{
  "id": "4c2133da-b560-5edc-9d8e-c61ea189277a",
  "title": "Verity",
  "productionYear": 2026,
  "ageRating": 15,
  "duration": 117,
  "language": {
    "original": "Engelska",
    "subtitles": "Svenska"
  },
  "posterImage": "/images/movies/verity-poster.jpg",
  "trailerUrl": "https://www.youtube.com/watch?v=xdPMKhjMSFs",
  "shortDescription": "En ung författare upptäcker mörka hemligheter när hon flyttar in hos den berömda författaren Verity Crawford.",
  "longDescription": "Lowen Ashleigh får i uppdrag att slutföra bokserien åt den berömda författaren Verity Crawford efter att en olycka gjort Verity oförmögen att skriva. När Lowen flyttar in hos familjen hittar hon ett manuskript som avslöjar mörka och skrämmande hemligheter. Snart börjar hon tvivla på vad som egentligen är sant.",
  "director_id": "a866b4d3-6591-5ef7-96c4-0bfa7d419932",
  "categories": [
    "Drama",
    "Mystery",
    "Thriller"
  ]
}
```

**Status:** `404 Not Found`

```json
{
  "error": "Film hittades inte"
}
```

## Movies with optional filters for ageRating, categories, and search term

### GET /movies?ageRating=15

**Status:** `200 OK`

```json
[
{
    "id": "3a4697bf-7d1a-53a1-98bf-708a03160659",
    "title": "The Exorcist",
    "productionYear": 1973,
    "ageRating": 15,
    "duration": 123,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/the-exorcist-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=BU2eYAO31Cc",
    "shortDescription": "Vågar du möta natten med en av skräckfilmens mest ikoniska filmer?",
    "longDescription": "När en ung flicka börjar uppvisa allt mer skrämmande beteende söker hennes mamma desperat efter hjälp. En legendarisk skräckklassiker visas vid midnatt på Halloween.",
    "director_id": "f49933d6-433d-4dd7-8c6a-c51856f61eb4"
  },
  {
    "id": "21fd09b4-8739-5130-a69c-67590fd343a1",
    "title": "Arkipelag",
    "productionYear": 2026,
    "ageRating": 15,
    "duration": 107,
    "language": {
      "original": "Svenska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/arkipelag-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=ke00C6G7ewg",
    "shortDescription": "Tre pappor följer med sina döttrar på en skolresa till en idyllisk skärgårdsö där lek snabbt övergår i maktkamp.",
    "longDescription": "Tre pappor följer med sina döttrar på en skolresa till en idyllisk skärgårdsö. När de blir strandsatta tillsammans med en stökig högstadieklass väcks gamla tonårstrauman till liv. Snart börjar både ungdomar och vuxna tvingas fundera över gränsen mellan lek, maktkamp, offer och förövare.",
    "director_id": "b272b14e-fe62-5ed0-a8d3-62f8ee295589"
  },
]
```
**Respons:** `400 Bad Request`

```json
{
  "error": "ageRating måste vara ett positivt tal"
}
```

### GET /movies?categories=Familj

**Respons:** `200 OK`

```json
[
    {
    "id": "552a1b46-ed3c-52ce-bfb8-964550cd90c4",
    "title": "Hocus Pocus",
    "productionYear": 1993,
    "ageRating": 7,
    "duration": 96,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/hocus-pocus-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=F4e6YQFrt1s",
    "shortDescription": "En magisk Halloweenvisning för hela familjen med de tre busiga Sanderson-systrarna.",
    "longDescription": "När tre häxor återuppstår på Halloween måste en grupp barn försöka stoppa dem innan de sprider kaos över staden. En färgstark Halloweenklassiker för både barn och vuxna.",
    "director_id": "03d341ee-8d53-4a34-82d0-20ccf8901bc9",
    "categories": [
      "Familj",
      "Komedi",
      "Fantasy"
    ]
  },
  {
    "id": "ef33e1fe-a3d6-5bc3-807a-44f2ebf55d70",
    "title": "Fjord",
    "productionYear": 2026,
    "ageRating": 11,
    "duration": 146,
    "language": {
      "original": "Norska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/fjord-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=0gdRZZVoinM",
    "shortDescription": "En familj flyttar till Norge för att börja om, men en konflikt med en grannfamilj förändrar allt.",
    "longDescription": "Det rumänsk-norska paret Mihai och Lisbeth flyttar till Norge med sina barn efter att Mihais föräldrar gått bort. De lär känna grannfamiljen Halberg och relationerna blir allt närmare. Men när parets dotter Elia kommer till skolan med blåmärken väcks misstankar och snart hamnar de båda familjerna i en konflikt om uppfostran, tro och frihet.",
    "director_id": "80fc4e70-3109-5b7c-b03e-de1788cce0bc",
    "categories": [
      "Familj",
      "Drama",
      "Thriller"
    ]
  }
]
```

**Respons:** `400 Bad Request`

```json
{
  "error": "Kategorin finns inte"
}
```

### GET /movies?search=verity

**Respons:** `200 OK`

```json
[
  {
    "id": "4c2133da-b560-5edc-9d8e-c61ea189277a",
    "title": "Verity",
    "productionYear": 2026,
    "ageRating": 15,
    "duration": 117,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/verity-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=xdPMKhjMSFs",
    "shortDescription": "En ung författare upptäcker mörka hemligheter när hon flyttar in hos den berömda författaren Verity Crawford.",
    "longDescription": "Lowen Ashleigh får i uppdrag att slutföra bokserien åt den berömda författaren Verity Crawford efter att en olycka gjort Verity oförmögen att skriva. När Lowen flyttar in hos familjen hittar hon ett manuskript som avslöjar mörka och skrämmande hemligheter. Snart börjar hon tvivla på vad som egentligen är sant.",
    "director_id": "a866b4d3-6591-5ef7-96c4-0bfa7d419932",
    "categories": [
      "Drama",
      "Mystery",
      "Thriller"
    ]
  }
]
```

**Respons:** `400 Bad Request`

```json
{
  "error": "Sökordet är för kort"
}
```

### GET /movies?ageRating=11&categories=Äventyr&search=odysseus

**Respons:** `200 OK`

```json
[
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
    "posterImage": "/images/movies/odyssey-poster.jpg",
    "trailerUrl": "https://www.youtube.com/watch?v=Mzw2ttJD2qQ",
    "shortDescription": "Odysseus ger sig ut på en lång och farofylld resa hem efter det trojanska kriget, där han möter gudar, monster och andra prövningar.",
    "longDescription": "Efter det trojanska kriget försöker kung Odysseus återvända hem till Ithaka och sin familj. Resan blir ett episkt äventyr fyllt av faror, mytiska varelser, mäktiga gudar och svåra val. Samtidigt väntar hans hustru Penelope och sonen Telemachos hemma på hans återkomst.",
    "director_id": "bab4795d-c38e-51c4-a013-f931be094a4c",
    "categories": [
      "Äventyr",
      "Drama",
      "Action",
      "Fantasy"
    ]
  }
]
```

---

## Users

Base URL: `http://localhost:3000/api`

## Current security status

All `/api/users`endpoints are currently blocked by temporary middleware.

**Status:** `403 Forbidden`

```json
{
  "error": "Åtkomst till användare är inte tillåten ännu"
}
```

Authentication and authorization must be implemented before these endpoints are made accessible. Users must not be allowed to access or modify other users' accounts without permission.

### POST /users

Creates a new user. The backend generates a UUID, hashes the password using bcrypt, and automatically assigns the role `customer`.

**Request body:**

```json
{
  "first_name": "Anna",
  "last_name": "Testsson",
  "email": "anna.testsson@example.com",
  "password": "ExamplePassword123!"
}
```

**Status:** `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Anna",
  "last_name": "Testsson",
  "email": "anna.testsson@example.com"
}
```

The password and its hash are never returned in the response. The client cannot choose the user's role.

**Other responses:**

- `400 Bad Request` - Missing, invalid or excessively long fields.
- `409 Conflict` - Email address already exists.
- `500 Internal Server Error` - Database or server error.

### GET /users/:id

Returns a user by ID without exposing the password hash.

**Example:** `GET /api/users/550e8400-e29b-41d4-a716-446655440000`

**Status:** `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Anna",
  "last_name": "Testsson",
  "email": "anna.testsson@example.com"
}
```

**Status:** `404 Not Found`

```json
{
  "error": "Användaren hittades inte."
}
```

**Other responses:**

- `500 Internal Server Error` – Database or server error.

### PATCH /users/:id

Updates an existing user's first name, last name or email.

Only `first_name`, `last_name` and `email` are allowed. Password changes are not supported by this endpoint.

**Example:** `PATCH /api/users/550e8400-e29b-41d4-a716-446655440000`

**Request body:**

```json
{
  "first_name": "Eva"
}
```

**Status:** `200 OK`

```json
{
  "message": "Användaren uppdaterades."
}
```

**Other responses:**

- `400 Bad Request` – Missing, invalid or disallowed fields.
- `404 Not Found` – User not found.
- `409 Conflict` – Email address already exists.
- `500 Internal Server Error` – Database or server error.

### DELETE /users/:id

Deletes a user by ID.

**Example:** `DELETE /api/users/550e8400-e29b-41d4-a716-446655440000`

**Status:** `204 No Content`

No response body is returned.

**Status:** `404 Not Found`

```json
{
  "error": "Användaren hittades inte."
}
```

**Other responses:**

- `409 Conflict` – The user cannot be deleted because of related database records.
- `500 Internal Server Error` – Database or server error.

### Testing status

- JavaScript syntax check: passed.
- Automated unit tests with mocked database: 8 passed.
- MySQL integration test: POST, GET, PATCH and DELETE passed against the `webapp` database using a temporary test user.
- Password hashing and default `customer` role verified against MySQL.
- Thunder Client: verified that GET, POST, PATCH and DELETE are blocked with status 403.
- Full HTTP testing of CRUD after authentication and authorization: pending.

The integration test invokes the route handlers directly and does not test authentication, authorization or the complete HTTP request flow.

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

# Seats

### GET /seats

Get all the seats from database.

**Respons:** `200 OK`

```json
[
  {
    "id": "seat-A1",
    "seat_row": "1",
    "seat_number": 1,
    "screen_id": "screen-1"
  },
  {
    "id": "seat-A2",
    "seat_row": "1",
    "seat_number": 2,
    "screen_id": "screen-1"
  }
]
```

**Fel:** `500 Internal Server Error`

```json
{
  "error": "Kunde inte hämta platser från databasen"
}
```

### GET /seats/available/:showId

Get all available seats for a specific show.

**Response 200 OK**

````json
[
  {
    "id": "seat-A1",
    "seat_row": "A",
    "seat_number": 1,
    "screen_id": "screen-1"
  }
]

**Response 404 Not Found**

```json
{
  "error": "Visningen hittades inte"
}

**Response 500 Internal Server Error**

```json
{
  "error": "Kunde inte hämta lediga platser från databasen"
}

# Ticket Types

### GET /api/ticket-types

Get all ticket types and their prices from the database.

**Response:** `200 OK`

```json
[
  {
    "id": "ticket-barn",
    "name": "Barn",
    "price": "80.00"
  },
  {
    "id": "ticket-pensionar",
    "name": "Pensionär",
    "price": "120.00"
  },
  {
    "id": "ticket-vuxen",
    "name": "Vuxen",
    "price": "140.00"
  }
]
```

**Fel:** `500 Internal Server Error`

```json
{
  "error": "Kunde inte hämta biljettyper från databasen"
}
```
