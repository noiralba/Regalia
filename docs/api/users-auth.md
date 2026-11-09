# Users and authentication

Base URL: `http://localhost:3000/api`

## Access rules

- `POST /api/users` is public, rate-limited to **5 requests per hour** per client IP.
- `POST /api/auth/login` is public, rate-limited to **10 requests per 15 minutes** per client IP.
- `GET`, `PATCH` and `DELETE /api/users/:id` and `GET /api/users/:id/bookings` require a valid JWT, and `:id` must match the authenticated user's ID.
- Browsers authenticate with the HttpOnly `regalia_session` cookie. Protected endpoints also accept `Authorization: Bearer <JWT_TOKEN>`.
- JWTs expire after 1 hour. A missing token returns `401`. A token for another user ID returns `403`.
- Passwords are hashed with bcrypt and never returned. Users cannot choose their own role: new accounts get the `customer` role.
- These rules cover only the endpoints on this page. They **do not** secure `/api/bookings` (see [bookings.md](bookings.md#security-warning)).

### Cookie authentication and CSRF protection

For state-changing requests that use the session cookie, the backend checks the request origin via `Origin` or `Referer`. Login and logout are checked too. Untrusted origins get `403 Forbidden`. Set `FRONTEND_ORIGIN` to the trusted frontend URL in production.

---

## POST /api/users

Registers a user. The API generates the UUID.

Required fields: `first_name`, `last_name`, `email`, `password`.

| Field | Limit |
| ----- | ----- |
| `first_name`, `last_name` | max 100 JavaScript string units each |
| `email` | max 150 |
| `password` | at least 15 Unicode code points, at most 72 UTF-8 bytes (bcrypt limit) |

**Request body**

```json
{
  "first_name": "Anna",
  "last_name": "Testsson",
  "email": "anna.testsson@example.invalid",
  "password": "ExamplePassword123!"
}
```

**`201 Created`**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Anna",
  "last_name": "Testsson",
  "email": "anna.testsson@example.invalid"
}
```

**Other responses**

- `400 Bad Request`: missing or invalid fields, invalid email, too-short password or excessive field length
- `409 Conflict`: email already exists
- `429 Too Many Requests`: registration rate limit reached
- `500 Internal Server Error`: database or server error

Example `400` for a short password:

```json
{ "error": "Lösenordet måste innehålla minst 15 tecken." }
```

---

## POST /api/auth/login

Authenticates with email and password. The email is trimmed and lowercased before lookup.

**Request body**

```json
{
  "email": "anna.testsson@example.invalid",
  "password": "ExamplePassword123!"
}
```

**`200 OK`**

The backend creates a JWT and stores it in the HttpOnly cookie `regalia_session` (1 hour, `SameSite=Lax`, `Path=/api`, `Secure` in production). The JWT is **not** in the JSON body.

```json
{ "expiresIn": 3600 }
```

**Other responses**

- `400 Bad Request`: missing email or password (`E-postadress och lösenord måste anges.`)
- `401 Unauthorized`: invalid credentials (`Felaktig e-postadress eller lösenord.`)
- `403 Forbidden`: request from an untrusted origin
- `429 Too Many Requests`: too many login attempts
- `500 Internal Server Error`: database, server or JWT configuration error

---

## GET /api/auth/session

Checks whether the current session is valid. The JWT can come from the session cookie or an `Authorization: Bearer` header.

**`200 OK`**

```json
{
  "authenticated": true,
  "expiresAt": 1794171600000
}
```

`expiresAt` is the JWT expiry in milliseconds since the Unix epoch. The value above is illustrative.

**Other responses**

- `401 Unauthorized`: missing, invalid or expired JWT
- `500 Internal Server Error`: JWT configuration error

---

## POST /api/auth/logout

Clears the `regalia_session` cookie.

**`204 No Content`**: the cookie is cleared, no body.

The JWT is not revoked on the server. Logout only removes the browser's cookie.

**Other responses**

- `403 Forbidden`: request from an untrusted origin

---

## GET /api/users/:id

Returns the authenticated user's account details, without the password hash.

**Authorization:** session cookie or `Bearer <JWT_TOKEN>`

**`200 OK`**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "Anna",
  "last_name": "Testsson",
  "email": "anna.testsson@example.invalid"
}
```

**Other responses:** `401` (missing, invalid or expired JWT), `403` (different user ID), `404` (account missing), `500`.

---

## PATCH /api/users/:id

Updates only `first_name`, `last_name` or `email` of the authenticated user. Password and role cannot be changed here.

**Authorization:** session cookie or `Bearer <JWT_TOKEN>`

**Request body**

```json
{ "first_name": "Eva" }
```

**`200 OK`**

```json
{ "message": "Användaren uppdaterades." }
```

**Other responses:** `400` (missing, invalid or disallowed fields), `401`, `403`, `404`, `409` (email already exists), `500`.

---

## DELETE /api/users/:id

Deletes the authenticated user's own account.

**Authorization:** session cookie or `Bearer <JWT_TOKEN>`

**`204 No Content`**: account deleted, no body.

**Other responses:** `401`, `403`, `404`, `409` (related database records prevent deletion), `500`.

---

## GET /api/users/:id/bookings

Returns the authenticated user's upcoming or past bookings for **Mina sidor**. The query filters on `bookings.user_id = :id`, and the middleware verifies that `:id` matches the authenticated user. Only summary fields are returned (no customer email or full booking details). Guest bookings without `user_id` are not included.

**Authorization:** session cookie or `Bearer <JWT_TOKEN>`

| Query parameter | Meaning |
| --------------- | ------- |
| `period=upcoming` | Upcoming showings (default). All upcoming bookings in chronological order. `offset` is not allowed. |
| `period=past` | Past showings, newest first, 2 bookings per page |
| `offset=0` | Start position for `period=past` (default 0). Use `offset=2`, `offset=4`, ... for **Visa fler** |

```text
GET /api/users/:id/bookings?period=upcoming
GET /api/users/:id/bookings?period=past&offset=0
GET /api/users/:id/bookings?period=past&offset=2
```

**`200 OK`** (illustrative)

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

For past bookings, `hasMore` says whether older results exist. With no matching bookings the response is `200 OK` with `{ "bookings": [], "hasMore": false }`.

**Other responses**

- `400 Bad Request`: invalid `period`, invalid `offset`, or `offset` used with `period=upcoming`
- `401 Unauthorized`: missing, invalid or expired JWT
- `403 Forbidden`: the requested user ID does not match the JWT user ID
- `500 Internal Server Error`: database or server error

The past/upcoming comparison uses the database server's `NOW()` with the stored show date and time. Confirm timezone handling in deployment.

---

## Testing status and limitations

- Automated tests: 13 passing Users CRUD/booking-list tests (mocked database) and 8 passing middleware tests.
- Manually HTTP-tested: registration, login, authenticated reads/updates/deletion, authentication and ownership errors, login and registration rate limits, and the booking-list endpoint (empty and nonempty results, invalid parameters, past-booking pagination, `401`, `403`, `400`).
- A nonempty booking list was verified against MySQL with a separate test user, and ownership was confirmed in DBeaver.
- Rate limiting uses an in-memory store. Limits reset when the backend restarts and are not shared between server instances.
- JWTs are not revoked when an account is deleted. An issued token may stay valid until its one-hour expiry. Future booking/admin authorization must account for this.
- The booking-list query groups rows by booking and show ID. A booking is currently tied to a single show. If bookings can later contain seats from several shows, revisit the query and pagination to avoid repeated entries.
