// Summary: This file defines the MovieDetailPage component, which displays detailed information about a specific movie, including its trailer, description, facts, cast, and available showtimes. It allows users to select a date and showing time for booking tickets.

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import type { Showing, Person } from "../types/types";
import { useMovieDetail } from "../hooks/useMovieDetail";
import { useSeatAvailability } from "../hooks/useSeatAvailability";
import { pickNextShowing } from "../utils/showings";
import { slugify, extractIdFromSlug } from "../utils/slugify";
import { getPersonWithBio } from "../utils/castMapper";
import TrailerPlayer from "../components/MovieDetail/TrailerPlayer/TrailerPlayer";
import MovieDescription from "../components/MovieDetail/MovieDescription/MovieDescription";
import MovieFacts from "../components/MovieDetail/MovieFacts/MovieFacts";
import CastCarousel from "../components/MovieDetail/CastCarousel/CastCarousel";
import ShowtimePicker from "../components/MovieDetail/ShowtimePicker/ShowtimePicker";
import BookingBar from "../components/MovieDetail/BookingBar/BookingBar";
import { ActorModal } from "../components/ActorModal/ActorModal";

export default function MovieDetailPage() {
  const { movieSlug } = useParams();
  const id = extractIdFromSlug(movieSlug);
  const navigate = useNavigate();

  const { movie, persons, showings, loading } = useMovieDetail(id);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowing, setSelectedShowing] = useState<Showing | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const seats = useSeatAvailability(selectedShowing);

  useEffect(() => {
    if (showings.length > 0 && !selectedShowing) {
      const first = pickNextShowing(showings);
      if (first) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedShowing(first);
        setSelectedDate(first["Screening Date"]);
      }
    }
  }, [showings, selectedShowing]);

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

  function handleSelectPerson(personFromCarousel: Person) {
    const fullPerson =
      getPersonWithBio(personFromCarousel.id, persons) || personFromCarousel;
    setSelectedPerson(fullPerson);
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
    <main className="page-container" aria-label="Filmdetaljer">
      <TrailerPlayer trailerUrl={movie.trailerUrl} title={movie.title} />

      <MovieDescription
        movie={movie}
        shortDescription={movie.shortDescription}
        longDescription={movie.longDescription}
      />
      <MovieFacts movie={movie} />

      <CastCarousel movie={movie} onSelectPerson={handleSelectPerson} />

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

      <ActorModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
      />
    </main>
  );
}
