# Regalia API – Documentation

Base URL: `http://localhost:3000`

## Global Error Handling (Status Codes)

The API returns standardized HTTP status codes:

- **`200 OK`**: The request succeeded.
- **`201 Created`**: The resource was created.
- **`204 No Content`**: The request succeeded; no content is returned.
- **`400 Bad Request`**: Validation error (e.g. invalid input).
- **`401 Unauthorized`**: API key or token is missing or invalid.
- **`403 Forbidden`**: You do not have permission to access this resource.
- **`404 Not Found`**: The requested resource was not found.
- **`409 Conflict`**: Conflict (e.g. email or seat already booked).
- **`500 Internal Server Error`**: An internal server error occurred.

---

# 1. Movies

### GET /movies

Retrieves all movies from the database with optional filters (`ageRating`, `categories`, `search`).

**Status:** `200 OK`

```json
[
  {
    "id": "11c4eb5d-8a47-5c66-9861-fcf3f5375a32",
    "title": "Bortglömda ön",
    "productionYear": 2026,
    "ageRating": "7",
    "duration": 109,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/bortglömda-ön-poster.webp",
    "trailerUrl": "Ri2KipSRQ4E",
    "shortDescription": "Jo och Raissa har varit bästa vänner sedan grundskolan men har nu gått ut High School och ska påbörja sina separata livsresor.",
    "longDescription": "Jo och Raissa har varit bästa vänner sedan grundskolan men har nu gått ut High School och ska påbörja sina separata livsresor. När de firar sin sista kväll tillsammans, råkar Jo och Raissa hitta en mystisk portal som transporterar dem till den fantastiska ön Nakali, full av de magiska och mytologiska väsen som hört berättelser om under uppväxten i sina filippinska familjer. En del av de här varelserna blir vänner, andra blir fiender. I sällskap med den välmenande men olyckliga hunden Raww och ett litet men mäktiga gäng kompisar, måste Jo och Raissa möta Den Fruktande Manananggal, den mest skräckinjagande varelsen på ön. När de upptäcker att priset för att återvända hem är att förlora alla minnena av deras vänskap, måste Jo och Raissa skynda sig att hitta ett sätt att lämna ön innan de helt glömmer bort varandra, för evigt.",
    "release_date": "2026-09-24T22:00:00.000Z",
    "director_id": "34cead7e-4ba6-5482-ba3e-68a2006d66ef",
    "categories": ["Familj", "Komedi", "Äventyr"]
  }
]
```

**Status:** `400 Bad Request` (For invalid filters)

```json
{
  "error": "ageRating måste vara ett positivt tal"
}
```

---

## Movies with optional filters for ageRating, categories, and search term

### GET /movies?ageRating=15

**Status:** `200 OK`

```json
[
  {
    "id": "3a4697bf-7d1a-53a1-98bf-708a03160659",
    "title": "The Exorcist",
    "productionYear": 1973,
    "ageRating": "15",
    "duration": 123,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/the-exorcist-poster.webp",
    "trailerUrl": "BU2eYAO31Cc",
    "shortDescription": "Vågar du möta natten med en av skräckfilmens mest ikoniska filmer?",
    "longDescription": "När en ung flicka börjar uppvisa allt mer skrämmande beteende söker hennes mamma desperat efter hjälp. En legendarisk skräckklassiker visas vid midnatt på Halloween.",
    "release_date": "1973-12-25T23:00:00.000Z",
    "director_id": "f49933d6-433d-4dd7-8c6a-c51856f61eb4",
    "categories": ["Övernaturlig", "Skräck", "Klassiker"]
  }
]
```

### GET /movies?categories=Family

**Response:** `200 OK`

```json
[
  {
    "id": "552a1b46-ed3c-52ce-bfb8-964550cd90c4",
    "title": "Hocus Pocus",
    "productionYear": 1993,
    "ageRating": "7",
    "duration": 96,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/hocus-pocus-poster.webp",
    "trailerUrl": "F4e6YQFrt1s",
    "shortDescription": "En magisk Halloweenvisning för hela familjen med de tre busiga Sanderson-systrarna.",
    "longDescription": "När tre häxor återuppstår på Halloween måste en grupp barn försöka stoppa dem innan de sprider kaos över staden. En färgstark Halloweenklassiker för både barn och vuxna.",
    "release_date": "1993-07-15T22:00:00.000Z",
    "director_id": "03d341ee-8d53-4a34-82d0-20ccf8901bc9",
    "categories": ["Familj", "Komedi", "Fantasy"]
  }
]
```

<!-- **Response:** `400 Bad Request`

```json
{
  "error": "Kategorin finns inte"
}
``` -->

### GET /movies?search=resident evil

**Response:** `200 OK`

```json
[
  {
    "id": "8c47b045-0053-5ea6-a1e2-a716c32e3f82",
    "title": "Resident Evil",
    "productionYear": 2026,
    "ageRating": "15",
    "duration": 94,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/resident-evil-poster.webp",
    "trailerUrl": "mNd1gb19A-c",
    "shortDescription": "Den medicinske kuriren Bryan dras ovetande in i en intensiv kamp för överlevnad.",
    "longDescription": "Den medicinske kuriren Bryan dras ovetande in i en intensiv kamp för överlevnad i en skoningslös kamp mot klockan. Resident Evil är en actionfylld skräckfilm som tar tittarna med på en spännande resa genom en värld fylld av faror och mysterier.",
    "release_date": "2026-09-17T22:00:00.000Z",
    "director_id": "b811763b-bef3-5e8f-b32c-d93f61d94cc4",
    "categories": ["Action", "Thriller", "Skräck"]
  }
]
```

**Response:** `400 Bad Request`

```json
{
  "error": "Sökordet är för kort"
}
```

### GET /movies?ageRating=11&categories=Äventyr&search=odysseus

**Response:** `200 OK`

```json
[
  {
    "id": "bb058c9e-8e1c-5458-a144-b2c1a34d4940",
    "title": "The Odyssey",
    "productionYear": 2026,
    "ageRating": "11",
    "duration": 180,
    "language": {
      "original": "Engelska",
      "subtitles": "Svenska"
    },
    "posterImage": "/images/movies/odyssey-poster.webp",
    "trailerUrl": "Mzw2ttJD2qQ",
    "shortDescription": "Odysseus ger sig ut på en lång och farofylld resa hem efter det trojanska kriget, där han möter gudar, monster och andra prövningar.",
    "longDescription": "Efter det trojanska kriget försöker kung Odysseus återvända hem till Ithaka och sin familj. Resan blir ett episkt äventyr fyllt av faror, mytiska varelser, mäktiga gudar och svåra val. Samtidigt väntar hans hustru Penelope och sonen Telemachos hemma på hans återkomst.",
    "release_date": "2026-07-16T22:00:00.000Z",
    "director_id": "bab4795d-c38e-51c4-a013-f931be094a4c",
    "categories": ["Äventyr", "Drama", "Action", "Fantasy"]
  }
]
```

---

### GET /movies/:id

Retrieves a specific movie by ID.

**Status:** `200 OK`

```json
{
  "id": "11c4eb5d-8a47-5c66-9861-fcf3f5375a32",
  "title": "Bortglömda ön",
  "productionYear": 2026,
  "ageRating": "7",
  "duration": 109,
  "language": {
    "original": "Engelska",
    "subtitles": "Svenska"
  },
  "posterImage": "/images/movies/bortglömda-ön-poster.webp",
  "trailerUrl": "Ri2KipSRQ4E",
  "shortDescription": "Jo och Raissa har varit bästa vänner sedan grundskolan men har nu gått ut High School och ska påbörja sina separata livsresor.",
  "longDescription": "Jo och Raissa har varit bästa vänner sedan grundskolan men har nu gått ut High School och ska påbörja sina separata livsresor. När de firar sin sista kväll tillsammans, råkar Jo och Raissa hitta en mystisk portal som transporterar dem till den fantastiska ön Nakali, full av de magiska och mytologiska väsen som hört berättelser om under uppväxten i sina filippinska familjer. En del av de här varelserna blir vänner, andra blir fiender. I sällskap med den välmenande men olyckliga hunden Raww och ett litet men mäktiga gäng kompisar, måste Jo och Raissa möta Den Fruktande Manananggal, den mest skräckinjagande varelsen på ön. När de upptäcker att priset för att återvända hem är att förlora alla minnena av deras vänskap, måste Jo och Raissa skynda sig att hitta ett sätt att lämna ön innan de helt glömmer bort varandra, för evigt.",
  "release_date": "2026-09-24T22:00:00.000Z",
  "director_id": "34cead7e-4ba6-5482-ba3e-68a2006d66ef",
  "categories": ["Familj", "Komedi", "Äventyr"]
}
```

**Status:** `404 Not Found`

```json
{
  "error": "Film hittades inte"
}
```

---

# 2. Users

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
- HTTP-tested: registration, login, authenticated account reads/updates/deletion, authentication and ownership errors, login/registration rate limits, and the new booking-list endpoint with empty results and invalid query parameters.
- Direct read-only SQL queries verified the booking-list table joins against existing nonempty booking data. An authenticated HTTP request returning a **nonempty** booking list has **not yet** been tested against MySQL.
- Rate limiting currently uses the in-memory store; limits reset when the backend process restarts and are not shared across multiple server instances.
- JWTs are not revoked immediately when an account is deleted; an already issued token may remain valid until its one-hour expiry. Future booking/admin authorization must account for this limitation.
- The separate existing `/api/bookings` routes currently include publicly accessible booking reads and booking updates without authentication checks, and booking creation accepts a client-supplied `user_id`. They need a separate security review; adding this Users endpoint does not fix those routes.
- The database query groups rows by booking and show ID. The current booking creation flow associates a booking with a single show. If bookings can later contain seats from multiple shows, revisit the list query and pagination to avoid repeated booking entries.

---

# 3. Screens

### GET /screens

Get all screens from the database.

**Response:** `200 OK`

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

**Error:** `500 Internal Server Error `

```json
{
  "error": "Kunde inte hämta salonger från databasen"
}
```

# 4. Seats

### GET /seats

Get all seats from the database.

**Status:** `200 OK`

```json
[
  {
    "id": "0fa91f26-d45e-49f0-6fdb-9d7e6f5f0d32",
    "seat_row": "C",
    "seat_number": 9,
    "screen_id": "a3f1c8d2-6b74-4e91-8f25-3d7a9c0b1e56"
  }
]
```

**Error:** `500 Internal Server Error`

```json
{
  "error": "Kunde inte hämta platser från databasen"
}
```

---

### GET /seats/available/:showId

Get all available seats for a specific screening.

**Status:** `200 OK`

```json
[
  {
    "show_id": "67c6b21d-c437-4697-b838-19742e0c11c0",
    "seat_id": "7d4c8b21-a513-4e92-bd68-1a4f3c7e2b90",
    "Seat Row": "A",
    "Seat Number": 6,
    "Status": "Ledig",
    "Available": 1
  }
]
```

**Status:** `404 Not Found`

```json
{
  "error": "Show not found."
}
```

---

# 5. Ticket Types

### GET /api/ticket-types

Retrieves all ticket types and prices.

**Status:** `200 OK`

```json
[
  {
    "ticket_type_id": "1a9d5e63-f274-48b1-83c6-2e7f4a0d9b52",
    "Ticket Type": "Vuxen",
    "Price (SEK)": "140.00"
  },
  {
    "ticket_type_id": "c4e7b219-8a53-46d0-9f12-5b3e7a1c6d84",
    "Ticket Type": "Pensionär",
    "Price (SEK)": "120.00"
  },
  {
    "ticket_type_id": "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43",
    "Ticket Type": "Barn",
    "Price (SEK)": "80.00"
  }
]
```

---

# 6. Bookings

### POST /api/bookings

Creates a new booking with the selected seats and ticket types.

**Request Body (JSON):**

```json
{
  "user_email": "jimbo@example.com",
  "show_id": "e6acb845-e822-48ff-a39c-718abc38f8b9",
  "seats": [
    {
      "seat_id": "e2a9b3c4-f714-4d81-8e2b-da943c71be25",
      "ticket_type_id": "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43"
    },
    {
      "seat_id": "8f3c7a21-4b9d-4e1a-bd23-ca981e4b2d35",
      "ticket_type_id": "1a9d5e63-f274-48b1-83c6-2e7f4a0d9b52"
    }
  ]
}
```

**Status:** `201 Created`

```json
{
  "booking_id": "2ecdd3bf-8aaf-486a-b3e2-fcdacd3e679c",
  "show_id": "e6acb845-e822-48ff-a39c-718abc38f8b9",
  "Booking Number": "REG-792362dd-2d64",
  "Booked At": "2026-10-21T18:04:05.000Z",
  "Customer Name": "Ej registrerad kund",
  "Email": "jimbo@example.com",
  "Movie": "Wildwood",
  "Screening Date": "2026-10-23",
  "Start Time": "21:00",
  "Screen": "Stora salongen",
  "Number of Tickets": 2,
  "Seats": "A7, A8",
  "Total Price (SEK)": "220.00",
  "Payment Information": "Betalning sker på plats"
}
```

**Status:** `409 Conflict` (If the seat is already occupied)

```json
{
  "error": "One or more of the selected seats are already booked for this show."
}
```

### GET /api/bookings

Retrieves all bookings in the system (Admin view / Test view).

**Status:** `200 OK`

```json
[
  {
    "booking_id": "00406b28-f567-4f78-96f0-f0a145008c67",
    "show_id": "28b69b01-5871-4812-83fd-35bb067fabde",
    "Booking Number": "BK-770440",
    "Booked At": "2026-10-21T16:46:21.000Z",
    "Customer Name": "2Rör 2ej okej",
    "Email": "2test_1@example.com",
    "Movie": "Bortglömda ön",
    "Screening Date": "2026-11-05",
    "Start Time": "21:00",
    "Screen": "Lila salongen",
    "Number of Tickets": 6,
    "Seats": "A1, A2, A3, A4, A5, A6",
    "Total Price (SEK)": "720.00",
    "Payment Information": "Betalning sker på plats"
  }
]
```

---

### GET /api/bookings/:id

Retrieves details for a specific booking by its ID.

**Status:** `200 OK`

```json
{
  "booking_id": "2ecdd3bf-8aaf-486a-b3e2-fcdacd3e679c",
  "show_id": "e6acb845-e822-48ff-a39c-718abc38f8b9",
  "Booking Number": "REG-792362dd-2d64",
  "Booked At": "2026-10-21T18:04:05.000Z",
  "Customer Name": "Ej registrerad kund",
  "Email": "jimbo@example.com",
  "Movie": "Wildwood",
  "Screening Date": "2026-10-23",
  "Start Time": "21:00",
  "Screen": "Stora salongen",
  "Number of Tickets": 2,
  "Seats": "A7, A8",
  "Total Price (SEK)": "220.00",
  "Payment Information": "Betalning sker på plats"
}
```

**Status:** `404 Not Found`

```json
{
  "error": "Bokning hittades inte."
}
```

---

### PUT/PATCH /api/bookings/:id

Updates an existing booking (e.g. changes the email or assigned user_id).

**Request Body (JSON):**

```json
{
  "user_email": "superjimbo@example.com",
  "show_id": "e6acb845-e822-48ff-a39c-718abc38f8b9",
  "seats": [
    {
      "seat_id": "e2a9b3c4-f714-4d81-8e2b-da943c71be25",
      "ticket_type_id": "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43"
    },
    {
      "seat_id": "8f3c7a21-4b9d-4e1a-bd23-ca981e4b2d35",
      "ticket_type_id": "1a9d5e63-f274-48b1-83c6-2e7f4a0d9b52"
    }
  ]
}
```

**Status:** `200 OK`

```json
{
  "booking_id": "eaded539-4b6a-402c-b3ec-bd176fa4d2b5",
  "show_id": "e6acb845-e822-48ff-a39c-718abc38f8b9",
  "Booking Number": "REG-2a09ef90-427d",
  "Booked At": "2026-10-21T18:43:29.000Z",
  "Customer Name": "Ej registrerad kund",
  "Email": "superjimbo@example.com",
  "Movie": "Wildwood",
  "Screening Date": "2026-10-23",
  "Start Time": "21:00",
  "Screen": "Stora salongen",
  "Number of Tickets": 2,
  "Seats": "A7, A8",
  "Total Price (SEK)": "220.00",
  "Payment Information": "Betalning sker på plats"
}
```

**Status:** `400 Bad Request`

```json
{
  "error": "[Fyll i felmeddelande vid ogiltig data]"
}
```

---

**Status:** `409 Conflict`

```json
{
  "error": "En eller flera av de valda platserna är redan bokade till den här visningen."
}
```

---

### DELETE /api/bookings/:id

Cancels/deletes a booking and frees up the seats in the system.

**Status:** `200 No Content`

```json
{
  "message": "Booking deleted successfully.",
  "id": "REG-792362dd-2d64"
}
```

**Status:** `404 Not Found`

```json
{
  "error": "Bokningen hittades inte."
}
```
