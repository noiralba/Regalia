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
  "trailerUrl": "Mzw2ttJD2qQ",
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
    "trailerUrl": "ejMMn0t58Lc",
    "shortDescription": "En klassisk spökhistoria för dig som vågar stanna kvar när lamporna släcks.",
    "longDescription": "Ed och Lorraine Warren hjälper en familj som flyttat in i ett hus där något mörkt och övernaturligt verkar ha vaknat. Se filmen tillsammans med andra skräckälskare under en sen Halloweenvisning.",
    "director_id": "40a9cff9-4eaf-48b0-a054-4fb136ae1dd6",
    "categories": ["Övernaturlig", "Thriller", "Skräck"]
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
    "trailerUrl": "Mzw2ttJD2qQ",
    "shortDescription": "Odysseus ger sig ut på en lång och farofylld resa hem efter det trojanska kriget, där han möter gudar, monster och andra prövningar.",
    "longDescription": "Efter det trojanska kriget försöker kung Odysseus återvända hem till Ithaka och sin familj. Resan blir ett episkt äventyr fyllt av faror, mytiska varelser, mäktiga gudar och svåra val. Samtidigt väntar hans hustru Penelope och sonen Telemachos hemma på hans återkomst.",
    "director_id": "bab4795d-c38e-51c4-a013-f931be094a4c",
    "categories": ["Äventyr", "Drama", "Action", "Fantasy"]
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
    "trailerUrl": "m9bOpeuvNwY",
    "shortDescription": "Coraline upptäcker en annan värld bakom en hemlig dörr – men allt är inte som det verkar.",
    "longDescription": "Coraline upptäcker en hemlig dörr i sitt nya hem som leder till en alternativ värld. Där verkar allt vara bättre än hemma, men snart upptäcker hon att den perfekta världen döljer en mörk hemlighet.",
    "director_id": "0e8f5c3e-9856-4fa7-b187-ea2babe4b8de",
    "categories": ["Animerat", "Skräck", "Fantasy"]
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
    "trailerUrl": "0gdRZZVoinM",
    "shortDescription": "En familj flyttar till Norge för att börja om, men en konflikt med en grannfamilj förändrar allt.",
    "longDescription": "Det rumänsk-norska paret Mihai och Lisbeth flyttar till Norge med sina barn efter att Mihais föräldrar gått bort. De lär känna grannfamiljen Halberg och relationerna blir allt närmare. Men när parets dotter Elia kommer till skolan med blåmärken väcks misstankar och snart hamnar de båda familjerna i en konflikt om uppfostran, tro och frihet.",
    "director_id": "80fc4e70-3109-5b7c-b03e-de1788cce0bc",
    "categories": ["Familj", "Drama", "Thriller"]
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
    "trailerUrl": "qORTe1wW3Wg",
    "shortDescription": "En mäktig oljemiljardär försöker övertyga världen om att han är mänsklighetens räddare innan katastrofen han själv orsakat förstör allt.",
    "longDescription": "Digger Rockwell är världens mäktigaste man och en av världens rikaste oljemiljardärer. När en katastrof som han själv har orsakat hotar att förändra världen försöker han desperat övertyga mänskligheten om att han är dess räddare. Filmen är en mörk och satirisk berättelse om makt, girighet, miljökatastrofer och ansvar.",
    "director_id": "98444e80-98ad-5c03-80de-2abd73692930",
    "categories": ["Komedi", "Drama", "Satir"]
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
  "trailerUrl": "xdPMKhjMSFs",
  "shortDescription": "En ung författare upptäcker mörka hemligheter när hon flyttar in hos den berömda författaren Verity Crawford.",
  "longDescription": "Lowen Ashleigh får i uppdrag att slutföra bokserien åt den berömda författaren Verity Crawford efter att en olycka gjort Verity oförmögen att skriva. När Lowen flyttar in hos familjen hittar hon ett manuskript som avslöjar mörka och skrämmande hemligheter. Snart börjar hon tvivla på vad som egentligen är sant.",
  "director_id": "a866b4d3-6591-5ef7-96c4-0bfa7d419932",
  "categories": ["Drama", "Mystery", "Thriller"]
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
    "trailerUrl": "BU2eYAO31Cc",
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
    "trailerUrl": "ke00C6G7ewg",
    "shortDescription": "Tre pappor följer med sina döttrar på en skolresa till en idyllisk skärgårdsö där lek snabbt övergår i maktkamp.",
    "longDescription": "Tre pappor följer med sina döttrar på en skolresa till en idyllisk skärgårdsö. När de blir strandsatta tillsammans med en stökig högstadieklass väcks gamla tonårstrauman till liv. Snart börjar både ungdomar och vuxna tvingas fundera över gränsen mellan lek, maktkamp, offer och förövare.",
    "director_id": "b272b14e-fe62-5ed0-a8d3-62f8ee295589"
  }
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
    "trailerUrl": "F4e6YQFrt1s",
    "shortDescription": "En magisk Halloweenvisning för hela familjen med de tre busiga Sanderson-systrarna.",
    "longDescription": "När tre häxor återuppstår på Halloween måste en grupp barn försöka stoppa dem innan de sprider kaos över staden. En färgstark Halloweenklassiker för både barn och vuxna.",
    "director_id": "03d341ee-8d53-4a34-82d0-20ccf8901bc9",
    "categories": ["Familj", "Komedi", "Fantasy"]
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
    "trailerUrl": "0gdRZZVoinM",
    "shortDescription": "En familj flyttar till Norge för att börja om, men en konflikt med en grannfamilj förändrar allt.",
    "longDescription": "Det rumänsk-norska paret Mihai och Lisbeth flyttar till Norge med sina barn efter att Mihais föräldrar gått bort. De lär känna grannfamiljen Halberg och relationerna blir allt närmare. Men när parets dotter Elia kommer till skolan med blåmärken väcks misstankar och snart hamnar de båda familjerna i en konflikt om uppfostran, tro och frihet.",
    "director_id": "80fc4e70-3109-5b7c-b03e-de1788cce0bc",
    "categories": ["Familj", "Drama", "Thriller"]
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
    "trailerUrl": "xdPMKhjMSFs",
    "shortDescription": "En ung författare upptäcker mörka hemligheter när hon flyttar in hos den berömda författaren Verity Crawford.",
    "longDescription": "Lowen Ashleigh får i uppdrag att slutföra bokserien åt den berömda författaren Verity Crawford efter att en olycka gjort Verity oförmögen att skriva. När Lowen flyttar in hos familjen hittar hon ett manuskript som avslöjar mörka och skrämmande hemligheter. Snart börjar hon tvivla på vad som egentligen är sant.",
    "director_id": "a866b4d3-6591-5ef7-96c4-0bfa7d419932",
    "categories": ["Drama", "Mystery", "Thriller"]
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
    "trailerUrl": "Mzw2ttJD2qQ",
    "shortDescription": "Odysseus ger sig ut på en lång och farofylld resa hem efter det trojanska kriget, där han möter gudar, monster och andra prövningar.",
    "longDescription": "Efter det trojanska kriget försöker kung Odysseus återvända hem till Ithaka och sin familj. Resan blir ett episkt äventyr fyllt av faror, mytiska varelser, mäktiga gudar och svåra val. Samtidigt väntar hans hustru Penelope och sonen Telemachos hemma på hans återkomst.",
    "director_id": "bab4795d-c38e-51c4-a013-f931be094a4c",
    "categories": ["Äventyr", "Drama", "Action", "Fantasy"]
  }
]
```

---

## Users

Base URL: `http://localhost:3000/api`

### Authentication, authorization and access

- `POST /api/users` is public and rate-limited to 5 requests per hour per client IP.
- `POST /api/auth/login` is public and rate-limited to 10 requests per 15 minutes per client IP.
- `GET /api/users/:id`, `PATCH /api/users/:id`, `DELETE /api/users/:id` and `GET /api/users/:id/bookings` require a valid JWT and allow access only when `:id` matches the authenticated user ID.
- Send the JWT in the header: `Authorization: Bearer <JWT_TOKEN>`.
- JWTs expire after 1 hour. A missing token returns `401 Unauthorized`; a token for another user ID returns `403 Forbidden`.
- Passwords are hashed with bcrypt and never included in user responses. Users cannot assign their own role; new accounts receive the `customer` role.
- These authorization rules cover the Users endpoints listed here. They **do not** secure the separate `/api/bookings` routes.

### POST /api/users

Register a user. The API generates a UUID. Required fields are `first_name`, `last_name`, `email`, and `password`. The backend limits first and last name to 100 JavaScript string units each and email to 150. Passwords must contain at least 15 Unicode code points and no more than 72 UTF-8 bytes (bcrypt limit).

**Request body:**

```json
{
  "first_name": "Anna",
  "last_name": "Testsson",
  "email": "anna.testsson@example.invalid",
  "password": "ExamplePassword123!"
}
```

**201 Created:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Anna",
  "last_name": "Testsson",
  "email": "anna.testsson@example.invalid"
}
```

**Other responses:**

- `400 Bad Request` — missing or invalid fields, invalid email, too-short password or excessive field length.
- `409 Conflict` — email already exists.
- `429 Too Many Requests` — registration rate limit reached.
- `500 Internal Server Error` — database or server error.

Example `400` response for a short password:

```json
{ "error": "Lösenordet måste innehålla minst 15 tecken." }
```

### POST /api/auth/login

Authenticate using email and password. Email is trimmed and normalized to lowercase for lookup.

**Request body:**

```json
{
  "email": "anna.testsson@example.invalid",
  "password": "ExamplePassword123!"
}
```

**200 OK:**

```json
{
  "token": "<JWT_TOKEN>",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

**Other responses:**

- `400 Bad Request` — missing email or password: `E-postadress och lösenord måste anges.`
- `401 Unauthorized` — invalid credentials: `Felaktig e-postadress eller lösenord.`
- `429 Too Many Requests` — too many login attempts.
- `500 Internal Server Error` — database, server or JWT configuration error.

### GET /api/users/:id

Return the authenticated user's account details without the password hash.

**Authorization:** `Bearer <JWT_TOKEN>`

**200 OK:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Anna",
  "last_name": "Testsson",
  "email": "anna.testsson@example.invalid"
}
```

**Other responses:** `401 Unauthorized` (missing/invalid/expired JWT), `403 Forbidden` (different user ID), `404 Not Found` (account missing), `500 Internal Server Error`.

### PATCH /api/users/:id

Update only the authenticated user's `first_name`, `last_name`, or `email`. Password and role changes are not supported by this endpoint.

**Authorization:** `Bearer <JWT_TOKEN>`

**Request body:**

```json
{ "first_name": "Eva" }
```

**200 OK:**

```json
{ "message": "Användaren uppdaterades." }
```

**Other responses:** `400 Bad Request` (missing, invalid or disallowed fields), `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` (email already exists), `500 Internal Server Error`.

### DELETE /api/users/:id

Delete the authenticated user's own account.

**Authorization:** `Bearer <JWT_TOKEN>`

**204 No Content:** Account deleted. No response body.

**Other responses:** `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict` (related database records prevent deletion), `500 Internal Server Error`.

### GET /api/users/:id/bookings

Return the authenticated user's upcoming or past bookings for **Mina sidor**. The query filters on `bookings.user_id = :id`, and the middleware verifies that `:id` matches the authenticated user ID. The response contains only summary fields, not customer email or complete booking details. Guest bookings with no associated `user_id` are not included.

**Authorization:** `Bearer <JWT_TOKEN>`

| Query parameter   | Meaning                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `period=upcoming` | Upcoming showings; default. Returns all upcoming bookings in chronological order. `offset` is not allowed. |
| `period=past`     | Past showings, newest first, 2 bookings per page.                                                          |
| `offset=0`        | Starting position for `period=past`; default 0. Use `offset=2`, `offset=4`, etc. for **Visa fler**.        |

Upcoming example: `GET /api/users/:id/bookings?period=upcoming`

Past example: `GET /api/users/:id/bookings?period=past&offset=0`

Next page: `GET /api/users/:id/bookings?period=past&offset=2`

**200 OK** — illustrative response:

```json
{
  "bookings": [
    {
      "booking_id": "example-booking-id",
      "movie_title": "Example movie",
      "show_date": "2026-10-10",
      "show_time": "19:00:00",
      "seat_count": 2
    }
  ],
  "hasMore": false
}
```

For past bookings, `hasMore` indicates whether additional older results exist. If the user has no matching bookings, the response is `200 OK` with `{ "bookings": [], "hasMore": false }`.

**Other responses:**

- `400 Bad Request` — invalid `period`, invalid `offset`, or `offset` supplied for `period=upcoming`.
- `401 Unauthorized` — missing, invalid or expired JWT.
- `403 Forbidden` — the requested user ID does not match the JWT user ID.
- `500 Internal Server Error` — database or server error.

The past/upcoming comparison uses the database server's `NOW()` with the stored showing date and time. Confirm timezone handling in deployment.

### Testing and current limitations

- Automated tests: 13 passing Users CRUD/booking-list tests with mocked database operations, plus 8 passing middleware tests.
- HTTP-tested: registration, login, authenticated account reads/updates/deletion, authentication and ownership errors, login/registration rate limits, and the booking-list endpoint with empty and nonempty results and invalid query parameters.
- Direct read-only SQL queries verified the booking-list table joins against existing nonempty booking data. An authenticated HTTP request returning a nonempty booking list was successfully verified against MySQL using a separate test user. The initial booking's ownership was also confirmed in DBeaver.
- Additional manual HTTP tests verified past-booking pagination: `period=past&offset=0` returned Resident Evil and Verity with `hasMore: true`. `period=past&offset=2` returned Digger with `hasMore: false`. Bookings were returned in descending screening date and time order.
- Additional manual HTTP tests verified that a missing JWT returns `401 Unauthorized`, accessing another user's bookings returns `403 Forbidden`, and an invalid `period` parameter returns `400 Bad Request`.
- Rate limiting currently uses the in-memory store; limits reset when the backend process restarts and are not shared across multiple server instances.
- JWTs are not revoked immediately when an account is deleted; an already issued token may remain valid until its one-hour expiry. Future booking/admin authorization must account for this limitation.
- The separate existing `/api/bookings` routes currently include publicly accessible booking reads and booking updates without authentication checks, and booking creation accepts a client-supplied `user_id`. They need a separate security review; adding this Users endpoint does not fix those routes.
- The database query groups rows by booking and show ID. The current booking creation flow associates a booking with a single show. If bookings can later contain seats from multiple shows, revisit the list query and pagination to avoid repeated booking entries.

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
### POST /api/bookings

Create a new booking with the selected show and seats. The booking number is generated automatically. The response includes the booking details, movie title, show date and time, selected seats, ticket types and total price.

**Request body:**

```json
{
  "user_email": "test@example.com",
  "show_id": "2355eb45-0fa0-47dd-bc2c-0ad294986b84",
  "seats": [
    {
      "seat_id": "2d8f6a41-c593-4b07-ae62-91f4d8b3c750",
      "ticket_type_id": "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43"
    },
    {
      "seat_id": "9c1b84f3-3a72-4d1e-84b2-09d1c8e73a5a",
      "ticket_type_id": "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43"
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "boknings_id": "generated-booking-id",
  "bokningsnummer": "REG-generated-booking-number",
  "filmtitel": "Fjord",
  "visningsdatum": "2026-11-05",
  "visningstid": "18:00:00",
  "platser_och_priser": "Rad A Plats 1 (Barn: 80.00 kr), Rad A Plats 2 (Barn: 80.00 kr)",
  "totalt_pris": "160.00"
}
```

**Errors:**

`400 Bad Request` — Required booking information is missing or invalid.

```json
{
  "error": "user_email, show_id and at least one seat are required."
}
```

`404 Not Found` — The specified show does not exist.

```json
{
  "error": "Show not found."
}
```

`409 Conflict` — One of the selected seats is already booked for the show.

```json
{
  "error": "One of the selected seats is already booked for this show."
}
```

`500 Internal Server Error` — An unexpected server or database error occurred.

```json
{
  "error": "Server error."
}
```

````
