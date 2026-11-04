import type { Seat } from "../types/types";

// Hämtar alla lediga stolar
export function getAvailableSeats(seats: Seat[]): Seat[] {
  return seats.filter((seat) => seat.Available === 1);
}

// Kontrollerar om stolar ligger bredvid varandra (adjacent = intilliggande)
export function areSeatsAdjacent(seats: Seat[]): boolean {
  for (let i = 1; i < seats.length; i++) {
    const previousSeat = seats[i - 1];
    const currentSeat = seats[i];

    if (
      currentSeat["Seat Row"] !== previousSeat["Seat Row"] ||
      currentSeat["Seat Number"] !== previousSeat["Seat Number"] + 1
    ) {
      return false;
    }
  }

  return true;
}

// Hittar bästa lediga gruppen av intilliggande stolar
export function findBestAvailableSeats(
  seats: Seat[],
  ticketCount: number,
  screen: string,
): string[] {
  if (ticketCount <= 0 || seats.length === 0) {
    return [];
  }

  const availableSeats = getAvailableSeats(seats);

  // Sortera stolarna efter rad och platsnummer
  const sortedSeats = [...availableSeats].sort((a, b) => {
    if (a["Seat Row"] !== b["Seat Row"]) {
      return a["Seat Row"].localeCompare(b["Seat Row"]);
    }

    return a["Seat Number"] - b["Seat Number"];
  });

  // Hitta salongens alla rader
  const rows = [...new Set(seats.map((seat) => seat["Seat Row"]))].sort();

  // Bestäm vilken rad som är bäst, lite framför mitten i stora,
  // lite bakom mitten i lilla salongen (Thomas ord).
  const preferredRow = screen === "Stora salongen" ? "D" : "D";

  let bestSeats: Seat[] = [];
  let bestScore = Infinity;

  // Gå igenom varje rad
  for (const row of rows) {
    const rowSeats = sortedSeats.filter((seat) => seat["Seat Row"] === row);

    // Testa grupper med rätt antal stolar
    for (let i = 0; i <= rowSeats.length - ticketCount; i++) {
      const group = rowSeats.slice(i, i + ticketCount);

      if (!areSeatsAdjacent(group)) {
        continue;
      }

      // Räkna ut hur nära den bästa raden som gruppen av platser ligger
      const rowDistance = Math.abs(
        rows.indexOf(row) - rows.indexOf(preferredRow),
      );

      // Räkna ut hur nära mitten av raden som gruppen ligger
      const allRowSeats = seats.filter((seat) => seat["Seat Row"] === row);

      const seatNumbers = allRowSeats.map((seat) => seat["Seat Number"]);

      const rowCenter =
        (Math.min(...seatNumbers) + Math.max(...seatNumbers)) / 2;

      const groupCenter =
        (group[0]["Seat Number"] + group[group.length - 1]["Seat Number"]) / 2;

      const centerDistance = Math.abs(groupCenter - rowCenter);

      // Lägre poäng betyder bättre placering
      const score = rowDistance * 2 + centerDistance;

      if (score < bestScore) {
        bestScore = score;
        bestSeats = group;
      }
    }
  }

  return bestSeats.map((seat) => seat.seat_id);
}
