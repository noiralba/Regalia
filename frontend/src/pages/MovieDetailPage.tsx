import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { get, getById } from "../api/api";
import type { Movies, Showing, SeatAvailability } from "../types/types";
import { getMovieImage } from "../utils/movieImages";
import { getPersonImage } from "../utils/personImages";
import TrailerModal from "../components/TrailerModal";

function MovieDetailPage() {
  const { id } = useParams();

  const [movie, setMovie] = useState<Movies | null>(null);
  const [showings, setShowings] = useState<Showing[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowing, setSelectedShowing] = useState<Showing | null>(null);
  const [seatAvailability, setSeatAvailability] = useState<SeatAvailability[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    async function fetchMovie() {
      try {
        if (!id) return;

        const data = await getById<Movies>("/api/movies", id);
        setMovie(data);

        const movieShowings = await get<Showing[]>(`/api/shows?movie_id=${id}`);

        setShowings(movieShowings);

        if (movieShowings.length > 0) {
          const dates = [
            ...new Set(
              movieShowings.map((showing) => showing["Screening Date"]),
            ),
          ];

          setSelectedDate(dates[0]);
        }
      } catch (error) {
        console.error("Kunde inte hämta filmen eller visningarna:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  useEffect(() => {
    async function fetchSeatAvailability() {
      if (!selectedShowing) {
        setSeatAvailability([]);
        return;
      }

      setSeatAvailability([]);

      try {
        const seats = await get<SeatAvailability[]>(
          `/api/seats/available-seats/${selectedShowing.show_id}`,
        );

        setSeatAvailability(seats);
      } catch (error) {
        console.error("Kunde inte hämta platsinformation:", error);
        setSeatAvailability([]);
      }
    }

    fetchSeatAvailability();
  }, [selectedShowing]);

  const dates = [
    ...new Set(showings.map((showing) => showing["Screening Date"])),
  ];

  const filteredShowings = showings
    .filter((showing) => showing["Screening Date"] === selectedDate)
    .sort((a, b) => a["Start Time"].localeCompare(b["Start Time"]));

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(`${date}T12:00:00`));
  }

  function formatTime(time: string) {
    return time.slice(0, 5);
  }

  const totalSeats = seatAvailability.length;

  const bookedSeats = seatAvailability.filter(
    (seat) => seat.Status === "Bokad",
  ).length;

  if (loading) return <p>Laddar film...</p>;

  if (!movie) return <p>Filmen kunde inte hittas.</p>;

  return (
    <main>
      <img
        src={getMovieImage(movie.posterImage)}
        alt={`Affisch för ${movie.title}`}
      />

      <h1>{movie.title}</h1>

      <button type="button" onClick={() => setShowTrailer(true)}>
        Se trailer
      </button>

      {showTrailer && (
        <TrailerModal
          trailerUrl={movie.trailerUrl}
          title={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}

      <p>{movie.shortDescription}</p>

      <button
        type="button"
        onClick={() => setShowFullDescription(!showFullDescription)}
      >
        {showFullDescription ? "Visa mindre" : "Visa mer"}
      </button>

      {showFullDescription && <p>{movie.longDescription}</p>}

      <p>År: {movie.productionYear}</p>
      <p>Åldersgräns: {movie.ageRating} år</p>
      <p>Längd: {movie.duration} minuter</p>
      <p>Originalspråk: {movie.language.original}</p>
      <p>Undertexter: {movie.language.subtitles}</p>

      <h2>Rollista</h2>

      {movie.cast && movie.cast.length > 0 ? (
        <section>
          {movie.cast.map((person) => (
            <article key={person.id}>
              <img src={getPersonImage(person.image)} alt={person.name} />
              <h3>{person.name}</h3>
              <p>Rollfigur: {person.character_name}</p>
            </article>
          ))}
        </section>
      ) : (
        <p>Ingen rollista tillgänglig.</p>
      )}

      <section>
        <h2>Visningstider</h2>

        {dates.length > 0 ? (
          <>
            <h3>Välj datum</h3>

            <nav aria-label="Välj visningsdatum">
              {dates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedShowing(null);
                    setSeatAvailability([]);
                  }}
                  aria-pressed={selectedDate === date}
                >
                  {formatDate(date)}
                </button>
              ))}
            </nav>

            <h3>Välj tid</h3>

            {filteredShowings.length > 0 ? (
              <section>
                {filteredShowings.map((showing) => (
                  <button
                    key={showing.show_id}
                    type="button"
                    onClick={() => setSelectedShowing(showing)}
                    aria-pressed={selectedShowing?.show_id === showing.show_id}
                  >
                    {formatTime(showing["Start Time"])}
                  </button>
                ))}
              </section>
            ) : (
              <p>Inga visningar det här datumet.</p>
            )}
            <section aria-live="polite">
              <h3>{selectedShowing ? selectedShowing.Screen : "Salongen"}</h3>

              {selectedShowing && totalSeats > 0 && (
                <p>
                  {bookedSeats} av {totalSeats}
                </p>
              )}

              {selectedShowing && totalSeats === 0 && (
                <p>
                  Kunde inte hämta platsinformationen för den här visningen.
                </p>
              )}

              <button
                type="button"
                disabled={!selectedShowing}
                onClick={() => {
                  if (!selectedShowing) return;

                  const bookingUrl = new URL(
                    "/booking",
                    window.location.origin,
                  );

                  bookingUrl.searchParams.set(
                    "show_id",
                    selectedShowing.show_id,
                  );

                  bookingUrl.searchParams.set(
                    "date",
                    selectedShowing["Screening Date"],
                  );

                  bookingUrl.searchParams.set(
                    "time",
                    selectedShowing["Start Time"],
                  );

                  window.location.href = bookingUrl.toString();
                }}
              >
                BOKA
              </button>
            </section>
          </>
        ) : (
          <p>Inga visningar hittades för den här filmen.</p>
        )}
      </section>
    </main>
  );
}

export default MovieDetailPage;
