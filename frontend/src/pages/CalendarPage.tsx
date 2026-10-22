import { useEffect, useState } from "react";
import { get } from "../api/api";
import type { MovieScreening } from "../types/types";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toLocaleDateString("sv-SE"),
  );

  const [showings, setShowings] = useState<MovieScreening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchShowings() {
      setLoading(true);
      setError("");

      try {
        const data = await get<MovieScreening[]>(
          `/api/shows?date=${selectedDate}`,
        );

        if (!cancelled) {
          setShowings(data);
        }
      } catch {
        if (!cancelled) {
          setError("Kunde inte hämta filmvisningar.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchShowings();

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  return (
    <main className="container py-4">
      <h1>Kalender</h1>

      <label htmlFor="screening-date">Välj datum</label>

      <input
        id="screening-date"
        type="date"
        value={selectedDate}
        onChange={(event) => setSelectedDate(event.target.value)}
      />

      <h2>Visningar {selectedDate}</h2>

      {loading ? (
        <p>Laddar visningar...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : showings.length === 0 ? (
        <p>Inga visningar för detta datum.</p>
      ) : (
        <ul>
          {showings.map((showing) => (
            <li key={showing.show_id}>
              {showing.Movie} – {showing["Start Time"]} – {showing.Screen}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
