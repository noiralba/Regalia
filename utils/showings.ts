//function to pick the next showing from a list of showings, based on the current date and time
import type { Showing } from "../types/types";

const toDateTime = (s: Showing) =>
  `${s["Screening Date"]}T${s["Start Time"].slice(0, 8)}`;

export function pickNextShowing(showings: Showing[]): Showing | null {
  const sorted = [...showings].sort((a, b) =>
    toDateTime(a).localeCompare(toDateTime(b)),
  );
  const now = new Date();
  return (
    sorted.find((s) => new Date(toDateTime(s)) >= now) ?? sorted[0] ?? null
  );
}