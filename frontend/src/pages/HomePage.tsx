import HeroSection from "../components/hero/HeroSection";
import MovieRow from "../components/MovieRow/MovieRow";
import VipBanner from "../components/VipBanner";

import { useEffect, useState } from "react";
import type { Movies } from "../types/types";
import { get } from "../api/api";
import Calendar from "../components/Calender/Calender";

function HomePage() {
  const [selectedDate] = useState(() => new Date().toLocaleDateString("sv-SE"));

  const [nowPlaying, setNowPlaying] = useState<Movies[]>([]);
  const [comingSoon, setComingSoon] = useState<Movies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const [latest, upcoming] = await Promise.all([
          get<Movies[]>("/api/movies/type/latest"),
          get<Movies[]>("/api/movies/type/upcoming"),
        ]);
        setNowPlaying(latest);
        setComingSoon(upcoming);
      } catch (err) {
        console.error("Kunde inte hämta filmer:", err);
        setError("Filmerna kunde inte laddas.");
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (loading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <HeroSection />
      <section className="container py-4">
        <MovieRow
          id="now-playing-heading"
          label="På bio just nu"
          movies={nowPlaying}
        />

        <VipBanner />

        <MovieRow
          id="coming-soon-heading"
          label="Kommer snart"
          movies={comingSoon}
        />

        <Calendar selectedDate={selectedDate} />
      </section>
    </>
  );
}

export default HomePage;
