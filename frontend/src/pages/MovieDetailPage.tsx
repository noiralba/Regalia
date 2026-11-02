// Summary: This file defines the MovieDetailPage component, which displays detailed information about a specific movie, including its trailer, description, facts, cast, and available showtimes. It allows users to select a date and showing time for booking tickets.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Showing } from "../types/types";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { useSeatAvailability } from "../hooks/useSeatAvailability";
import { pickNextShowing } from "../utils/showings";
import { slugify, extractIdFromSlug } from "../utils/slugify";
import TrailerPlayer from "../components/TrailerPlayer";
import MovieDescription from "../components/MovieDetail/MovieDescription";
import MovieFacts from "../components/MovieDetail/MovieFacts";
import CastCarousel from "../components/MovieDetail/CastCarousel";
import ShowtimePicker from "../components/MovieDetail/ShowTimePicker";
import BookingBar from "../components/MovieDetail/BookingBar";
import "../styles/MovieDetailPage.scss";

export default function MovieDetailPage() {
  const { movieSlug } = useParams();
  const id = extractIdFromSlug(movieSlug);
  const navigate = useNavigate();

  const { movie, showings, loading } = useMovieDetail(id);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowing, setSelectedShowing] = useState<Showing | null>(null);
  const seats = useSeatAvailability(selectedShowing);

  // Förvälj närmaste kommande visning när visningarna har laddats
  useEffect(() => {
    const first = pickNextShowing(showings);
    setSelectedDate(first?.["Screening Date"] ?? null);
    setSelectedShowing(first);
  }, [showings]);

  const dates = [...new Set(showings.map((s) => s["Screening Date"]))].sort();

  const filteredShowings = showings
    .filter((s) => s["Screening Date"] === selectedDate)
    .sort((a, b) => a["Start Time"].localeCompare(b["Start Time"]));

  function selectDate(date: string) {
    setSelectedDate(date);
    setSelectedShowing(
      pickNextShowing(showings.filter((s) => s["Screening Date"] === date)),
    );
  }

  function bookShowing() {
    if (!selectedShowing) return;
    const titleSlug = slugify(movie?.title || "okand-film");
    const date = selectedShowing["Screening Date"];
    const time = selectedShowing["Start Time"].slice(0, 5).replace(":", "-");
    navigate(
      `/bokning/${titleSlug}-${date}-${time}-${selectedShowing.show_id}`,
    );
  }

  if (loading) return <p>Laddar film...</p>;
  if (!movie) return <p>Filmen kunde inte hittas.</p>;

  return (
    <main className="movie-detail">
      <TrailerPlayer trailerUrl={movie.trailerUrl} title={movie.title} />
      <h1 className="movie-detail__title">{movie.title}</h1>

      <MovieDescription
        shortDescription={movie.shortDescription}
        longDescription={movie.longDescription}
      />
      <MovieFacts movie={movie} />
      <CastCarousel movie={movie} />

      <section
        className="movie-detail__showtimes"
        aria-labelledby="showtimes-heading"
      >
        <h2 className="movie-detail__heading" id="showtimes-heading">
          Visningstider
        </h2>

        {dates.length > 0 ? (
          <>
            <ShowtimePicker
              dates={dates}
              showings={filteredShowings}
              selectedDate={selectedDate}
              selectedShowing={selectedShowing}
              onSelectDate={selectDate}
              onSelectShowing={setSelectedShowing}
            />
            <BookingBar
              hasShowing={!!selectedShowing}
              seatsLoading={seats.loading}
              totalSeats={seats.total}
              availableSeats={seats.available}
              Screen={selectedShowing?.Screen || ""}
              onBook={bookShowing}
            />
          </>
        ) : (
          <p>Inga visningar hittades för den här filmen.</p>
        )}
      </section>
    </main>
  );
}
