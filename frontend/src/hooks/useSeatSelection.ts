import { useEffect, useMemo, useState } from "react";
import type { Seat } from "../types/types";
import { findBestAvailableSeats } from "../utils/seatSelection";

export function useSeatSelection(
  seats: Seat[],
  ticketCount: number,
  screen: string,
) {
  // Räknar ut vilka platser som rekommenderas
const recommendedSeats = useMemo(() => {
  return findBestAvailableSeats(seats, ticketCount, screen);
}, [seats, ticketCount, screen]);

  // Håller reda på vilka platser besökaren har valt
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Håller reda på om besökaren själv har börjat välja platser
  const [hasManuallySelectedSeats, setHasManuallySelectedSeats] =
    useState(false);

  useEffect(() => {
    if (ticketCount === 0) {
      setSelectedSeats([]);
      setHasManuallySelectedSeats(false);
      return;
    }

    // Vänta tills salong och platser finns
    if (!screen || seats.length === 0) {
      return;
    }

    // Skriv inte över besökarens manuella platsval
    if (hasManuallySelectedSeats) {
      return;
    }

    // Markera de rekommenderade platserna
    setSelectedSeats(recommendedSeats);
  }, [
    ticketCount,
    screen,
    seats.length,
    recommendedSeats,
    hasManuallySelectedSeats,
  ]);
  
function toggleSeat(seatId: string) {
  const isFirstManualSelection = !hasManuallySelectedSeats;

  setHasManuallySelectedSeats(true);

  setSelectedSeats((previous) => {
    // Om besökaren klickar på en redan markerad plats,
    // avmarkera bara den platsen.
    if (previous.includes(seatId)) {
      return previous.filter((id) => id !== seatId);
    }

    // Första manuella valet ersätter den automatiska förmarkeringen.
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
