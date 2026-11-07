import type { Person } from "../types/types";

export function getPersonWithBio(
  actorId: string,
  allPersons: Person[],
): Person | null {
  const found = allPersons.find((person) => person.id === actorId);
  if (!found) return null;
  return found;
}
