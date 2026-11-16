# Ticket types

## GET /api/ticket-types

Returns all ticket types and prices.

**`200 OK`**

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

Use `ticket_type_id` as `ticket_type_id` when creating a booking. Property names contain spaces, so use bracket notation in code.

**`500 Internal Server Error`**

```json
{ "error": "Kunde inte hämta biljettyper från databasen" }
```

> **To confirm:** the `500` error was only in an older draft. Check that it still exists.
