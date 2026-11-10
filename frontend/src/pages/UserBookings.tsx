import React from "react";
import { useOutletContext } from "react-router";
import { useFetchBookings } from "../hooks/useFetchBookings";
import { BookingItem } from "../components/UserBookings/BookingItem";

interface LayoutContext {
  userId?: string;
  userEmail?: string;
}

export const UserBookings: React.FC = () => {
  const { userId } = useOutletContext<LayoutContext>();
  const { bookings, isLoading, error } = useFetchBookings(userId);

  if (!userId) {
    return <p role="alert">Du måste logga in för att se dina bokningar.</p>;
  }

  if (isLoading) return <p role="status">Laddar bokningar...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (bookings.length === 0)
    return <p>Du har inga kommande bokningar just nu.</p>;

  return (
    <section aria-labelledby="bookings-heading">
      <h2 id="bookings-heading">Mina bokningar</h2>
      <ul>
        {bookings.map((booking) => (
          <BookingItem key={booking.booking_id} booking={booking} />
        ))}
      </ul>
    </section>
  );
};

export default UserBookings;
