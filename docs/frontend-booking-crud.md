# Booking CRUD in React (TanStack Query)

How to perform Create, Read, Update and Delete on bookings by combining the generic API client with **TanStack Query** in React + TypeScript.

> **To confirm:** earlier drafts imported helpers from `@/utils/api` with absolute `http://localhost:3000/...` URLs. The README uses `../api/api` and relative `/api/...` URLs through the Vite proxy. This guide uses the README convention. Adjust the import path to match your actual setup.

> **Security:** the `/api/bookings` endpoints currently have no authentication. See [api/bookings.md](api/bookings.md).

## 1. Types

These map to the `bookings` and `booked_seats` tables and the `v_order_confirmation` view.

```ts
// Request bodies
export interface BookingSeatInput {
  seat_id: string;        // seats.id (UUID)
  ticket_type_id: string; // ticket_types.id (UUID)
}

export interface BookingInput {
  user_email: string;
  show_id: string;        // shows.id (UUID)
  seats: BookingSeatInput[];
}

// Response bodies
export interface BookingResponse {
  booking_id: string;
  show_id: string;
  "Booking Number": string;   // human-readable code, used as ID for GET/PUT/DELETE
  "Booked At": string;        // ISO timestamp
  "Customer Name": string;    // full name, or "Ej registrerad kund"
  Email: string;
  Movie: string;
  "Screening Date": string;   // YYYY-MM-DD
  "Start Time": string;       // HH:MM
  Screen: string;
  "Number of Tickets": number;
  Seats: string;              // e.g. "B3, B4"
  "Total Price (SEK)": string;
  "Payment Information": string; // defaults to "Betalning sker på plats"
}

export interface DeleteResponse {
  message: string;
  id: string; // the deleted Booking Number
}
```

## 2. Create: book tickets (`POST`)

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "../api/api";
import type { BookingInput, BookingResponse } from "../types/booking";

export function CreateBooking() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newBooking: BookingInput) =>
      post<BookingResponse, BookingInput>("/api/bookings", newBooking),
    onSuccess: (data) => {
      alert(`Booking successful! Your booking number is: ${data["Booking Number"]}`);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const handleBooking = () => {
    createMutation.mutate({
      user_email: "jimbo@example.com",
      show_id: "e6acb845-e822-48ff-a39c-718abc38f8b9",
      seats: [
        {
          seat_id: "c3d4e5f6-a7b8-49c0-d1e2-f3a4b5c6d7e8",
          ticket_type_id: "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43",
        },
      ],
    });
  };

  return (
    <button onClick={handleBooking} disabled={createMutation.isPending}>
      {createMutation.isPending ? "Processing..." : "Complete Booking"}
    </button>
  );
}
```

## 3. Read: fetch a booking (`GET` by Booking Number)

```tsx
import { useQuery } from "@tanstack/react-query";
import { getById } from "../api/api";
import type { BookingResponse } from "../types/booking";

export function SearchBooking({ bookingNumber }: { bookingNumber: string }) {
  const { data: booking, isLoading, isError, error } = useQuery<BookingResponse>({
    queryKey: ["booking", bookingNumber],
    queryFn: () => getById<BookingResponse>("/api/bookings", bookingNumber),
    enabled: !!bookingNumber, // do not run until a number is provided
  });

  if (isLoading) return <div>Searching for booking records...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!booking) return null;

  return (
    <div className="booking-card">
      <h3>Reservation details: {booking["Booking Number"]}</h3>
      <p><strong>Movie:</strong> {booking.Movie}</p>
      <p><strong>Screen:</strong> {booking.Screen}</p>
      <p><strong>Date & time:</strong> {booking["Screening Date"]} at {booking["Start Time"]}</p>
      <p><strong>Seats:</strong> {booking.Seats}</p>
      <p><strong>Total:</strong> {booking["Total Price (SEK)"]} SEK</p>
      <small>Status: {booking["Payment Information"]}</small>
    </div>
  );
}
```

## 4. Update: modify a booking (`PUT`)

The Booking Number goes in the path. The body has the same shape as for `POST`.

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { put } from "../api/api";
import type { BookingInput, BookingResponse } from "../types/booking";

export function UpdateBooking({ bookingNumber }: { bookingNumber: string }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updatedData: BookingInput) =>
      put<BookingResponse, BookingInput>(`/api/bookings/${bookingNumber}`, updatedData),
    onSuccess: () => {
      alert("Booking successfully updated!");
      queryClient.invalidateQueries({ queryKey: ["booking", bookingNumber] });
    },
  });

  const handleUpdate = () => {
    updateMutation.mutate({
      user_email: "superjimbo@example.com", // updated email
      show_id: "e6acb845-e822-48ff-a39c-718abc38f8b9",
      seats: [
        {
          seat_id: "c3d4e5f6-a7b8-49c0-d1e2-f3a4b5c6d7e8",
          ticket_type_id: "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43",
        },
      ],
    });
  };

  return (
    <button onClick={handleUpdate} disabled={updateMutation.isPending}>
      {updateMutation.isPending ? "Saving changes..." : "Update Booking"}
    </button>
  );
}
```

## 5. Delete: cancel a booking (`DELETE`)

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { del } from "../api/api";
import type { DeleteResponse } from "../types/booking";

export function CancelBooking({ bookingNumber }: { bookingNumber: string }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => del<DeleteResponse>(`/api/bookings/${bookingNumber}`),
    onSuccess: (data) => {
      alert(`Cancellation confirmed: ${data.message}`);
      queryClient.removeQueries({ queryKey: ["booking", bookingNumber] });
    },
  });

  return (
    <button
      onClick={() => {
        if (window.confirm("Are you sure you want to cancel this booking?"))
          deleteMutation.mutate();
      }}
      disabled={deleteMutation.isPending}
      style={{ color: "red" }}
    >
      {deleteMutation.isPending ? "Cancelling..." : "Cancel Reservation"}
    </button>
  );
}
```

## Guidelines

1. **Properties with spaces.** The database views use names like `"Booking Number"` and `"Total Price (SEK)"`. Always use bracket notation: `booking["Booking Number"]`.
2. **Cache invalidation.** Pair every `POST`, `PUT` and `DELETE` with the matching query invalidation (or removal) so the UI updates without a page reload.
3. **Cascading deletes.** Deleting a row in `bookings` automatically deletes the matching rows in `booked_seats` (`ON DELETE CASCADE`). No extra API calls are needed.
