import { useState } from "react";
import type { Seat } from "../types/types";
import { findBestAvailableSeats } from "../utils/seatSelection";

export function useSeatSelection(
  seats: Seat[],
  ticketCount: number,
  screen: string,
) {
  // Räknar ut vilka platser som rekommenderas
  const recommendedSeats = findBestAvailableSeats(seats, ticketCount, screen);

  // Håller reda på vilka platser besökaren har valt
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Håller reda på om besökaren själv har börjat välja platser
  const [hasManuallySelectedSeats, setHasManuallySelectedSeats] =
    useState(false);

  return {
    recommendedSeats,
    selectedSeats,
    setSelectedSeats,
    hasManuallySelectedSeats,
    setHasManuallySelectedSeats,
  };
}
