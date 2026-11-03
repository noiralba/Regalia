import { useCallback, useState } from "react";
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

  return { seats, refreshSeats };
}
