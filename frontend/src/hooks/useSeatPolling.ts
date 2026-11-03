import { useCallback, useEffect, useState } from "react";
import type { Seat } from "../types/types";

// Custom hook som hanterar sittplatser a för en filmvisning
export function useSeatPolling(visningId: string | undefined) {
  const [seats, setSeats] = useState<Seat[]>([]);

  // Hämtar aktuell information om sittplatser från backend
  const refreshSeats = useCallback(async () => {
    if (!visningId) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/seats/available-seats/${visningId}`,
      );

      if (!response.ok) {
        throw new Error("Kunde inte hämta sittplatserna");
      }

      const data: Seat[] = await response.json();

      setSeats(data);
    } catch (error) {
      console.error("Fel vid hämtning av sittplatser:", error);
    }
  }, [visningId]);

  useEffect(() => {
    if (!visningId) return;

    // Hämtar sittplatserna när sidan öppnas
    void refreshSeats();
    // Startar intervall som hämtar sittplatser varannan sekund
    const interval = setInterval(() => {
      void refreshSeats();
    }, 2000);
    // Stoppar pollingen när användaren lämnar sidan/byter visning
    return () => {
      clearInterval(interval);
    };
  }, [visningId, refreshSeats]);

  return { seats, refreshSeats };
}
