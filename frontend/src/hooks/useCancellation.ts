import { useEffect, useState } from "react";
import type { BookingSearch } from "../types/types";
import { get, del } from "../api/api";

export function useCancellation() {
  const [bookings, setBookings] = useState<BookingSearch[]>([]);
  const [booking, setBooking] = useState<BookingSearch | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  // Hämta bokningar från backend
  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await get<Record<string, string>[]>("/api/bookings");

        setBookings(
          data.map((b) => ({
            bookingNumber: b["Booking Number"],
            email: b["Email"],
          })),
        );
      } catch (err) {
        console.error("Kunde inte hämta bokningar:", err);
        setError("Bokningarna kunde inte laddas.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  // Sök efter en bokning med bokningsnummer och e-postadress
  function searchBooking(bookingNumber: string, email: string) {
    setNotFound(false);
    setCancelError(null);
    setCancelled(false);

    const found = bookings.find(
      (b) =>
        b.bookingNumber === bookingNumber.trim() &&
        b.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (found) {
      setBooking(found);
      return true;
    }

    setBooking(null);
    setNotFound(true);
    return false;
  }

  // Avboka vald bokning
  async function cancelBooking() {
    if (!booking) return;

    try {
      await del(`/api/bookings/${encodeURIComponent(booking.bookingNumber)}`);

      setBookings((previous) =>
        previous.filter((b) => b.bookingNumber !== booking.bookingNumber),
      );

      setCancelled(true);
      setBooking(null);
      setCancelError(null);
      return true;
    } catch (err) {
      console.error("Kunde inte avboka:", err);
      setCancelError("Bokningen kunde inte avbokas. Försök igen.");
      return false;
    }
  }

  return {
    bookings,
    booking,
    loading,
    error,
    notFound,
    cancelError,
    cancelled,
    searchBooking,
    cancelBooking,
  };
}
