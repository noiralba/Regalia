import HeroSection from "../components/hero/HeroSection";
import MovieRow from "../components/MovieRow/MovieRow";
import VipBanner from "../components/VipBanner/VipBanner";
import Calendar from "../components/Calender/Calender";

import "../styles/HomePage.scss";

import { useEffect, useState } from "react";
import type { MovieThumbnails } from "../types/types";
import { get } from "../api/api";
import SearchBar from "../components/SearchBar/SearchBar";

function HomePage() {
  const [selectedDate] = useState(() => new Date().toLocaleDateString("sv-SE"));

  const [nowPlaying, setNowPlaying] = useState<MovieThumbnails[]>([]);
  const [comingSoon, setComingSoon] = useState<MovieThumbnails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const [latest, upcoming] = await Promise.all([
          get<MovieThumbnails[]>("/api/movies/type/latest"),
          get<MovieThumbnails[]>("/api/movies/type/upcoming"),
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
    <main className="home-page">
      <SearchBar />
      <section className="home-hero-section">
        <HeroSection />
      </section>

      <section className="home-content">
        <section className="page-section">
          <MovieRow
            id="now-playing-heading"
            label="På bio just nu"
            movies={nowPlaying}
          />
        </section>

        <section className="page-section">
          <VipBanner />
        </section>

        <section className="page-section">
          <MovieRow
            id="coming-soon-heading"
            label="Kommer snart"
            movies={comingSoon}
          />
        </section>

        <section className="page-section">
          <Calendar selectedDate={selectedDate} />
        </section>
      </section>
    </main>
  );
}

export default HomePage;
