# Screens and seats

## GET /screens

Returns all screens.

**`200 OK`**

```json
[
  { "id": "screen-1", "name": "Stora Salongen", "capacity": 81 },
  { "id": "screen-2", "name": "Lilla Salongen", "capacity": 45 }
]
```

**`500 Internal Server Error`**

```json
{ "error": "Kunde inte hämta salonger från databasen" }
```

---

## GET /seats

Returns all seats.

**`200 OK`**

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

**`500 Internal Server Error`**

```json
{ "error": "Kunde inte hämta platser från databasen" }
```

---

## GET /seats/available/:showId

Returns the available seats for a specific show.

**`200 OK`**

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

**`404 Not Found`**

```json
{ "error": "Show not found." }
```

**`500 Internal Server Error`**

```json
{ "error": "Kunde inte hämta lediga platser från databasen" }
```

> **To confirm:** the `404` message is in English, unlike the other errors. Decide whether it should be Swedish ("Visningen hittades inte" in an older draft). Also check that the `500` error still exists.
