import type { Show } from "../shared/types";

export type ShowFilter = "upcoming" | "past" | "all";

// Formulärets värden (som strängar, så som <input> ger dem)
export interface ShowFormValues {
  movieId: string;
  screenId: string;
  date: string;
  time: string;
}

// Nuvarande lokal tid som "ÅÅÅÅ-MM-DD TT:MM", jämförbar med visningarnas datum + tid
function currentDateTime(): string {
  return new Date().toLocaleString("sv-SE").slice(0, 16);
}

// Filtrerar på kommande/tidigare. Kommande sorteras äldst först, övriga nyast först.
export function filterAndSortShows(shows: Show[], filter: ShowFilter): Show[] {
  const now = currentDateTime();
  const isUpcoming = (show: Show) => `${show.date} ${show.time}` >= now;

  return shows
    .filter((show) =>
      filter === "all" ? true : filter === "upcoming" ? isUpcoming(show) : !isUpcoming(show),
    )
    .sort((a, b) => {
      const result = `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
      return filter === "upcoming" ? result : -result;
    });
}
