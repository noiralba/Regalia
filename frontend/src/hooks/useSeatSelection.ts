import { useCallback, useMemo, useState } from "react";
import type { Seat } from "../types/types";
import { findBestAvailableSeats } from "../utils/seatSelection";

// hook som hanterar rekommendationer och manuella platsval
export function useSeatSelection(
  seats: Seat[],
  ticketCount: number,
  screen: string,
) {
  // Räknar ut vilka platser som rekommenderas (intilligande)
  const recommendedSeats = useMemo(() => {
    return findBestAvailableSeats(seats, ticketCount, screen);
  }, [seats, ticketCount, screen]);

  // SParar de platser besökaren själv har valt manuellt
  const [manualSeats, setManualSeats] = useState<string[]>([]);

  // Detta avgör om vi ska visa manuella platsval eller rekommendera
  const [hasManuallySelectedSeats, setHasManuallySelectedSeats] =
    useState(false);
  // Avgör vilka platser som ska vara markerade på sittplatskartan
  const selectedSeats = hasManuallySelectedSeats
    ? manualSeats
    : ticketCount > 0
      ? recommendedSeats
      : [];
  //Detta låter Bookingpage uppdatera platsvalen
  const setSelectedSeats = useCallback(
    (update: React.SetStateAction<string[]>) => {
      setHasManuallySelectedSeats(true);
      setManualSeats(update);
    },
    [],
  );
  //toggleSeat körs när en användare klickar på en sittplats
  function toggleSeat(seatId: string) {
    if (ticketCount === 0) {
      return;
    }
    // Kollar om detta är användarens första manuella platsval
    const isFirstManualSelection = !hasManuallySelectedSeats;

    setHasManuallySelectedSeats(true);
    //Hanterar användarens klick på platser
    setManualSeats((previous) => {
      const currentSeats = isFirstManualSelection ? selectedSeats : previous;

      // Klick på en redan markerad plats avmarkerar bara den
      if (currentSeats.includes(seatId)) {
        return currentSeats.filter((id) => id !== seatId);
      }

      // Första klicket på en annan plats ersätter den förvalda platsen
      if (isFirstManualSelection) {
        return [seatId];
      }

      // Tillåt inte fler platser än antalet biljetter.
      if (previous.length >= ticketCount) {
        return previous;
      }

      return [...previous, seatId];
    });
  }

  return {
    recommendedSeats,
    selectedSeats,
    setSelectedSeats,
    hasManuallySelectedSeats,
    setHasManuallySelectedSeats,
    toggleSeat,
  };
}

// useMemo: en inbyggd React-hook som används för memoisering,
// vilket innebär att den sparar resultatet av en beräkning mellan olika renderingar
