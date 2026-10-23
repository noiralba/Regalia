# CRUD Documentation: Ticket Bookings

This documentation explains how to perform full **CRUD** (Create, Read, Update, Delete) operations for ticket bookings by combining our generic API client (`api.ts`) with **TanStack Query** (React Query) inside a React TypeScript environment.

---

## 1. Data Models & TypeScript Interfaces

These interfaces map exactly to the relational structure of the database tables (`bookings`, `booked_seats`) and the database view `v_order_confirmation` which provides the compiled payload structures.

```typescript
// Payload sent TO the API (Request Bodies)
export interface BookingSeatInput {
  seat_id: string; // References seats.id (UUID)
  ticket_type_id: string; // References ticket_types.id (UUID)
}

export interface BookingInput {
  user_email: string; // Saved to bookings.user_email
  show_id: string; // References shows.id (UUID)
  seats: BookingSeatInput[];
}

// Data structures returned FROM the API (Response Bodies)
export interface BookingResponse {
  booking_id: string;
  show_id: string;
  "Booking Number": string; // Unique human-readable code used as ID for GET/PUT/DELETE
  "Booked At": string; // ISO Timestamp
  "Customer Name": string; // Resolved user fullname or 'Ej registrerad kund'
  Email: string;
  Movie: string;
  "Screening Date": string; // YYYY-MM-DD
  "Start Time": string; // HH:MM
  Screen: string; // Screen/Auditorium name
  "Number of Tickets": number;
  Seats: string; // Comma-separated list (e.g., "B3, B4")
  "Total Price (SEK)": string; // Summed decimal value
  "Payment Information": string; // Statistically defaults to 'Betalning sker på plats'
}

export interface DeleteResponse {
  message: string;
  id: string; // Returns the Booking Number that was deleted
}
```

---

## 2. CREATE: Book Tickets (POST)

To submit a new booking, use TanStack Query's `useMutation` hook alongside the generic `post` method from `api.ts`.

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "@/utils/api";
import { BookingInput, BookingResponse } from "@/types/booking";

export function CreateBooking() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newBooking: BookingInput) =>
      post<BookingResponse, BookingInput>(
        "http://localhost:3000/api/bookings",
        newBooking,
      ),
    onSuccess: (data) => {
      alert(
        `Booking Successful! Your booking number is: ${data["Booking Number"]}`,
      );

      // Invalidate the cache to force list updates across the app
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const handleBooking = () => {
    const bookingData: BookingInput = {
      user_email: "jimbo@example.com",
      show_id: "e6acb845-e822-48ff-a39c-718abc38f8b9",
      seats: [
        {
          seat_id: "c3d4e5f6-a7b8-49c0-d1e2-f3a4b5c6d7e8",
          ticket_type_id: "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43",
        },
      ],
    };
    createMutation.mutate(bookingData);
  };

  return (
    <button onClick={handleBooking} disabled={createMutation.isPending}>
      {createMutation.isPending ? "Processing..." : "Complete Booking"}
    </button>
  );
}
```

---

## 3. READ: Fetch a Specific Booking (GET by ID)

To lookup a booking record using its unique **Booking Number** string as the primary parameter, call TanStack's `useQuery` along with the generic `getById` utility.

```tsx
import { useQuery } from "@tanstack/react-query";
import { getById } from "@/utils/api";
import { BookingResponse } from "@/types/booking";

export function SearchBooking({ bookingNumber }: { bookingNumber: string }) {
  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useQuery<BookingResponse>({
    queryKey: ["booking", bookingNumber],
    queryFn: () =>
      getById<BookingResponse>(
        "http://localhost:3000/api/bookings",
        bookingNumber,
      ),
    enabled: !!bookingNumber, // The query will not execute automatically unless a booking number is provided
  });

  if (isLoading) return <div>Searching for booking records...</div>;
  if (isError) return <div>❌ Error: {error.message}</div>;
  if (!booking) return null;

  return (
    <div className="booking-card">
      <h3>Reservation Details: {booking["Booking Number"]}</h3>
      <p>
        <strong>Movie:</strong> {booking.Movie}
      </p>
      <p>
        <strong>Screen:</strong> {booking.Screen}
      </p>
      <p>
        <strong>Date & Time:</strong> {booking["Screening Date"]} at{" "}
        {booking["Start Time"]}
      </p>
      <p>
        <strong>Assigned Seats:</strong> {booking.Seats}
      </p>
      <p>
        <strong>Total amount:</strong> {booking["Total Price (SEK)"]} SEK
      </p>
      <small>Status: {booking["Payment Information"]}</small>
    </div>
  );
}
```

---

## 4. UPDATE: Modify an Existing Booking (PUT)

To update a reservation, parse the unique **Booking Number** into the endpoint path route parameter and append the modified configuration structure using `useMutation` and `put`.

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { put } from "@/utils/api";
import { BookingInput, BookingResponse } from "@/types/booking";

export function UpdateBooking({ bookingNumber }: { bookingNumber: string }) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updatedData: BookingInput) =>
      put<BookingResponse, BookingInput>(
        `http://localhost:3000/api/bookings/${bookingNumber}`,
        updatedData,
      ),
    onSuccess: () => {
      alert("Booking successfully updated!");

      // Force synchronizations by invalidating cache queries for this specific token
      queryClient.invalidateQueries({ queryKey: ["booking", bookingNumber] });
    },
  });

  const handleUpdate = () => {
    const updatedData: BookingInput = {
      user_email: "superjimbo@example.com", // Updated email address
      show_id: "e6acb845-e822-48ff-a39c-718abc38f8b9",
      seats: [
        {
          seat_id: "c3d4e5f6-a7b8-49c0-d1e2-f3a4b5c6d7e8",
          ticket_type_id: "8f2c4a71-3d96-4b05-ae18-7c9d2f6b1a43",
        },
      ],
    };
    updateMutation.mutate(updatedData);
  };

  return (
    <button onClick={handleUpdate} disabled={updateMutation.isPending}>
      {updateMutation.isPending
        ? "Saving changes..."
        : "Update Booking Contact"}
    </button>
  );
}
```

---

## 5. DELETE: Cancel a Booking (DELETE)

To completely delete or drop records from `bookings` and cascade across linked seat row indices, issue an active network target lookup utilizing the **Booking Number** and the generic `del` method.

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { del } from "@/utils/api";
import { DeleteResponse } from "@/types/booking";

export function CancelBooking({ bookingNumber }: { bookingNumber: string }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () =>
      del<DeleteResponse>(
        `http://localhost:3000/api/bookings/${bookingNumber}`,
      ),
    onSuccess: (data) => {
      alert(`Cancellation Confirmed: ${data.message}`);

      // Purge query instances directly from cache layers to protect runtime state consistency
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

---

## 💡 Developer Guidelines & Best Practices

1. **Handling Properties with Spaces:** The database views compile attributes using spaces (e.g., `"Booking Number"`, `"Total Price (SEK)"`). Ensure that you map these values precisely within string bracket access notations inside your components (`booking["Booking Number"]`).
2. **Deterministic Cache Invalidation:** Always pair state adjustments (`POST`, `PUT`, `DELETE`) with exact query cache invalidations so that user UI updates dynamically without full page loads.
3. **Casacading Deletes:** Removing a record from the `bookings` table automatically drops corresponding seats in `booked_seats` due to relational database foreign key rules (`ON DELETE CASCADE`). No additional API calls are required to clean up table dependencies.
