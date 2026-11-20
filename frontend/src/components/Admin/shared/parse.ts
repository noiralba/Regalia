// JSON-kolumner från databasen kan komma som objekt/array ELLER som sträng,
// beroende på databasdrivrutin. De här hjälparna hanterar båda fallen.

export function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

export function toStringArray(value: unknown): string[] {
  const list = parseJson<unknown>(value, []);
  return Array.isArray(list) ? list.filter(Boolean).map(String) : [];
}

// "2026-11-01T00:00:00.000Z" -> "2026-11-01" (för <input type="date">)
export function toDateInput(value: string | null | undefined): string {
  return value ? value.split("T")[0] : "";
}
