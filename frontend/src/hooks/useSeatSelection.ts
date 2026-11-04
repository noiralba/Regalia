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
  // Vänta tills biljetter, salong och platser finns
  if (ticketCount === 0 || !screen || seats.length === 0) {
    return;
  }

  // Skriv inte över besökarens manuella platsval
  if (hasManuallySelectedSeats) {
    return;
    }
    

  // Markera de rekommenderade platserna
  setSelectedSeats(recommendedSeats);
}, [ticketCount, screen, recommendedSeats, hasManuallySelectedSeats]);
  
function toggleSeat(seatId: string) {
  setHasManuallySelectedSeats(true);

  setSelectedSeats((previous) => {
    // Avmarkera stolen om den redan är vald
    if (previous.includes(seatId)) {
      return previous.filter((id) => id !== seatId);
    }

    // Tillåt inte fler stolar än antalet biljetter
    if (previous.length >= ticketCount) {
      return previous;
    }

    // Markera den nya stolen
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
