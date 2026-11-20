import type { AdminMovie } from "../shared/types";

// "2026-11-01T00:00:00.000Z" -> "2026-11-01"
export const day = (value: string | null | undefined) =>
  value ? value.split("T")[0] : null;

// Dagens datum som "ÅÅÅÅ-MM-DD" (lokal tid)
export const todayString = () => new Date().toLocaleDateString("sv-SE");

export function movieStatus(movie: AdminMovie, today: string) {
  const start = day(movie.release_date);
  const end = day(movie.end_date);

  if (start && start > today) return { label: "Kommande", bg: "info" };
  if (end && end < today) return { label: "Avslutad", bg: "secondary" };
  if (start) return { label: "Visas nu", bg: "success" };
  return { label: "Utan datum", bg: "secondary" };
}

// Antal filmer som visas just nu respektive kommer
export function countCurrentAndUpcoming(movies: AdminMovie[], today: string) {
  let current = 0;
  let upcoming = 0;

  for (const movie of movies) {
    const start = day(movie.release_date);
    const end = day(movie.end_date);
    if (!start) continue;

    if (start > today) upcoming++;
    else if (!end || end >= today) current++;
  }

  return { current, upcoming };
}
