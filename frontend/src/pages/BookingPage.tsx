import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface MovieScreening {
  show_id: string;
  Movie: string;
  "Screening Date": string;
  "Start Time": string;
  Screen: string;
  "Available Seats": number;
}

function BookingPage() {
  const { visningId } = useParams();

  const [showing, setShowing] = useState<MovieScreening | null>(null);
  const [error, setError] = useState("");
  // Hämta info om vald filmvisnign från backend 
  useEffect(() => {
    if (!visningId) return;

    async function fetchShowing() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/shows/${visningId}`,
        );

        if (!response.ok) {
          throw new Error("Could not fetch showing");
        }

        const data: MovieScreening = await response.json();
        setShowing(data);
      } catch (error) {
        console.error(error);
        setError("Kunde inte hämta filmvisningen.");
      }
    }

    fetchShowing();
  }, [visningId]);

  return (
    <main>
      <h1>Boka biljetter</h1>

      <section>
        <h2>Vald visning</h2>

        {error && <p>{error}</p>}

        {!showing && !error && <p>Hämtar visning...</p>}

        {showing && (
          <>
            <p>Film: {showing.Movie}</p>
            <p>Datum: {showing["Screening Date"]}</p>
            <p>Tid: {showing["Start Time"]}</p>
            <p>Salong: {showing.Screen}</p>
          </>
        )}
      </section>
    </main>
  );
}

export default BookingPage;
