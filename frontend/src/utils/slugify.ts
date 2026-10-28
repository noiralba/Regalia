// src/utils/slugify.ts

// Gör om en sträng till "titel-vänlig-text"
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ersätt mellanslag med -
    .replace(/å/g, "a") // Ersätt åäö
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^\w\-]+/g, "") // Ta bort alla specialtecken förutom -
    .replace(/\-\-+/g, "-"); // Ta bort dubbla -
}

// Plockar ut det sista UUID:t från en kombinerad URL-sträng
export function extractIdFromSlug(slug: string | undefined): string {
  if (!slug) return "";
  const parts = slug.split("-");

  // Ett UUID består oftast av 5 delar separerade med bindestreck.
  // Om vi tar de sista 5 elementen och sätter ihop dem får vi tillbaka vårt UUID.
  return parts.slice(-5).join("-");
}
