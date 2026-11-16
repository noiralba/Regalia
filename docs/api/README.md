# Regalia API reference

Base URL (local development): `http://localhost:3000`

Error messages in the examples are in Swedish, exactly as the API returns them. All other text is in English.

## Endpoints

| Area | Endpoints | Path prefix | Document |
| ---- | --------- | ----------- | -------- |
| Movies | `GET /movies`, `GET /movies/:id` | none | [movies.md](movies.md) |
| Users and auth | `/api/users`, `/api/auth/*` | `/api` | [users-auth.md](users-auth.md) |
| Screens and seats | `GET /screens`, `GET /seats`, `GET /seats/available/:showId` | none | [screens-seats.md](screens-seats.md) |
| Ticket types | `GET /api/ticket-types` | `/api` | [ticket-types.md](ticket-types.md) |
| Bookings | `/api/bookings` | `/api` | [bookings.md](bookings.md) |

> **To confirm:** movies, screens and seats are served at the root path, while everything else is under `/api`. Make sure the frontend and the Vite proxy agree on this.

## Health check

```json
{ "message": "Regalia API fungerar" }
```

*(Status `200 OK`. The path of this endpoint is not documented, so please add it.)*

## Global status codes

| Code | Meaning |
| ---- | ------- |
| `200 OK` | The request succeeded |
| `201 Created` | The resource was created |
| `204 No Content` | The request succeeded, no body is returned |
| `400 Bad Request` | Validation error (e.g. invalid input) |
| `401 Unauthorized` | Token or session is missing, invalid or expired |
| `403 Forbidden` | No permission (e.g. another user's ID, or untrusted origin) |
| `404 Not Found` | The resource was not found |
| `409 Conflict` | Conflict (e.g. email exists or seat already booked) |
| `429 Too Many Requests` | Rate limit reached |
| `500 Internal Server Error` | Unexpected server or database error |

## Error format

Errors are returned as JSON with a single `error` field:

```json
{ "error": "Film hittades inte" }
```

## Authentication overview

Only the Users endpoints listed in [users-auth.md](users-auth.md) require authentication. Browsers use the HttpOnly `regalia_session` cookie. `Authorization: Bearer <JWT_TOKEN>` is also accepted.

> **Security warning:** the `/api/bookings` routes are **not** covered by this authentication. See [bookings.md](bookings.md#security-warning).

## Documenting a new endpoint

Follow the pattern in the existing files and document **all** responses for the endpoint (success and each error status). Use English headings and descriptions, and keep the real Swedish `error` strings in the JSON examples.
