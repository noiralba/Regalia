import { useCallback, useEffect, useRef, useState } from "react";
import type { Seat } from "../types/types";

// Custom hook som hanterar sittplatser a för en filmvisning
export function useSeatPolling(visningId: string | undefined) {
  const [seats, setSeats] = useState<Seat[]>([]);
  // Håller reda på om ett API-anrop redan är igång
  const isFetching = useRef(false);

  // Hämtar aktuell information om sittplatser från backend
  const refreshSeats = useCallback(async () => {
    if (!visningId) return;
    // Avbryt om ett API-anrop redan är igång
    if (isFetching.current) return;

    // visar att hämtningen har startats
    isFetching.current = true;

    try {
      const response = await fetch(
        `http://localhost:3000/api/seats/available-seats/${visningId}`,
      );

      if (!response.ok) {
        throw new Error("Kunde tyvärr inte hämta sittplatserna");
      }

      const data: Seat[] = await response.json();

      setSeats(data);
    } catch (error) {
      console.error("Fel vid hämtning av sittplatser:", error);
    } finally {
      // Markerar att hämtningen är avslutad
      isFetching.current = false;
    }
  }, [visningId]);

  useEffect(() => {
    if (!visningId) return;

    // Hämtar sittplatserna när sidan öppnas
    const timeout = setTimeout(() => {
      void refreshSeats();
    }, 0);

    // Starta intervall som hämtar sittplatser varannan sekund
    const interval = setInterval(() => {
      void refreshSeats();
    }, 2000);

    // Stoppar pollingen när användaren lämnar sidan/byter visning
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [visningId, refreshSeats]);

  return { seats, refreshSeats };
}
