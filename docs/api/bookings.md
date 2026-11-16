# Bookings

Base path: `/api/bookings`

## Security warning

The booking routes currently have **no authentication or authorization**:

- Booking reads (`GET`) are publicly accessible.
- Booking updates (`PUT/PATCH`) and deletes have no authentication checks.
- Booking creation accepts a client-supplied `user_id`.

They need a separate security review. The authentication on the Users endpoints does not protect them.

---

## POST /api/bookings

Creates a booking for the selected show, seats and ticket types. The booking number is generated automatically.

**Request body**

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

**`201 Created`**

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

**`400 Bad Request`**: required booking information is missing or invalid

```json
{ "error": "user_email, show_id and at least one seat are required." }
```

**`404 Not Found`**: the show does not exist

```json
{ "error": "Show not found." }
```

**`409 Conflict`**: a selected seat is already booked for this show

```json
{ "error": "One or more of the selected seats are already booked for this show." }
```

**`500 Internal Server Error`**

```json
{ "error": "Server error." }
```

> **To confirm:** the `400`, `404` and `500` messages come from an older draft that used a different response format. Check them against the backend.

---

## GET /api/bookings

Returns all bookings (admin/test view). See the [security warning](#security-warning).

**`200 OK`**

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

## GET /api/bookings/:id

Returns one booking. `:id` is the **Booking Number** (e.g. `REG-792362dd-2d64`).

**`200 OK`**: same shape as one item in `GET /api/bookings`.

**`404 Not Found`**

```json
{ "error": "Bokning hittades inte." }
```

---

## PUT /api/bookings/:id

Updates an existing booking (for example the email or the assigned `user_id`). `:id` is the Booking Number. The request body has the same shape as for `POST`.

**Request body**

```json
{
  "user_email": "superjimbo@example.com",
  "show_id": "e6acb845-e822-48ff-a39c-718abc38f8b9",
  "seats": [
    {
      "seat_id": "e2a9b3c4-f714-4d81-8e2b-da943c71be25",
      "ticket_type_id": "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43"
    }
  ]
}
```

**`200 OK`**: the updated booking, same shape as `POST` (with the new `Email`).

**`400 Bad Request`**

```json
{ "error": "TODO: add the real error message for invalid data" }
```

**`409 Conflict`**

```json
{ "error": "En eller flera av de valda platserna är redan bokade till den här visningen." }
```

> **To confirm:** the `400` error message is still a placeholder. Also decide whether `PATCH` is supported alongside `PUT`; earlier drafts listed both. Note that the `409` message here is Swedish while the same error on `POST` is English.

---

## DELETE /api/bookings/:id

Cancels a booking and frees its seats. `:id` is the Booking Number.

**`200 OK`**

```json
{
  "message": "Booking deleted successfully.",
  "id": "REG-792362dd-2d64"
}
```

**`404 Not Found`**

```json
{ "error": "Bokningen hittades inte." }
```

> **To confirm:** earlier drafts said `200 No Content`, which is contradictory. Because a body is returned, `200 OK` is documented here. If the backend returns `204`, remove the body. Also note that the `404` message differs from `GET` ("Bokning hittades inte." vs "Bokningen hittades inte."). Pick one.
