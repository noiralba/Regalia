import { useEffect, useState } from "react";
import { api } from "../components/Admin/shared/api"; // Justera till din api-sökväg
import type { BookingUsers } from "../types/types";

export function useFetchBookings(userId: string | undefined) {
  const [bookings, setBookings] = useState<BookingUsers[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await api.getUserBookings(userId);

        if (data && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          setBookings([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ett oväntat fel uppstod.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  return { bookings, isLoading, error };
}
