// A custom hook to fetch seat availability for a given showing.
import { useEffect, useState } from "react";
import { get } from "../api/api";
import type { Showing, SeatAvailability } from "../types/types";

export function useSeatAvailability(showing: Showing | null) {
  const [seats, setSeats] = useState<SeatAvailability[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchSeats() {
      setSeats([]);
      if (!showing) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await get<SeatAvailability[]>(
          `/api/seats/available-seats/${showing.show_id}`,
        );
        if (!cancelled) setSeats(data);
      } catch (error) {
        console.error("Kunde inte hämta platsinformation:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSeats();
    return () => {
      cancelled = true;
    };
  }, [showing]);

  const total = seats.length;
  const booked = seats.filter((s) => s.Status === "Bokad").length;

  return { loading, total, available: total - booked };
}