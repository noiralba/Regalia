import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { get, getById } from "../api/api";
import type { Movies, Showing, SeatAvailability } from "../types/types";
import { getPersonImage } from "../utils/personImages";
import TrailerPlayer from "../components/TrailerPlayer";
import "../styles/MovieDetailPage.scss";

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
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchMovie() {
      setLoading(true);

      try {
        if (!id) return;

        const movieData = await getById<Movies>("/api/movies", id);
        const movieShowings = await get<Showing[]>(`/api/shows?movie_id=${id}`);

        if (cancelled) return;

        setMovie(movieData);
        setShowings(movieShowings);

        const sortedShowings = [...movieShowings].sort((a, b) => {
          const dateA = `${a["Screening Date"]}T${a["Start Time"]}`;
          const dateB = `${b["Screening Date"]}T${b["Start Time"]}`;
          return dateA.localeCompare(dateB);
        });

        const now = new Date();

        const firstShowing =
          sortedShowings.find((showing) => {
            const dateTime = new Date(
              `${showing["Screening Date"]}T${showing["Start Time"].slice(0, 8)}`,
            );
            return dateTime >= now;
          }) ??
          sortedShowings[0] ??
          null;

        setSelectedDate(firstShowing?.["Screening Date"] ?? null);
        setSelectedShowing(firstShowing);
      } catch (error) {
        console.error("Kunde inte hämta filmen eller visningarna:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMovie();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function fetchSeatAvailability() {
      if (!selectedShowing) {
        setSeatAvailability([]);
        setSeatsLoading(false);
        return;
      }

      setSeatAvailability([]);
      setSeatsLoading(true);

      try {
        const seats = await get<SeatAvailability[]>(
          `/api/seats/available-seats/${selectedShowing.show_id}`,
        );

        if (!cancelled) {
          setSeatAvailability(seats);
        }
      } catch (error) {
        console.error("Kunde inte hämta platsinformation:", error);

        if (!cancelled) {
          setSeatAvailability([]);
        }
      } finally {
        if (!cancelled) {
          setSeatsLoading(false);
        }
      }
    }

    fetchSeatAvailability();

    return () => {
      cancelled = true;
    };
  }, [selectedShowing]);

  const dates = [
    ...new Set(showings.map((showing) => showing["Screening Date"])),
  ].sort((a, b) => a.localeCompare(b));

  const filteredShowings = showings
    .filter((showing) => showing["Screening Date"] === selectedDate)
    .sort((a, b) => a["Start Time"].localeCompare(b["Start Time"]));

  const totalSeats = seatAvailability.length;

  const bookedSeats = seatAvailability.filter(
    (seat) => seat.Status === "Bokad",
  ).length;

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("sv-SE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(`${date}T12:00:00`));
  }

  function formatTime(time: string) {
    return time.slice(0, 5);
  }

  function selectDate(date: string) {
    setSelectedDate(date);

    const dateShowings = showings
      .filter((showing) => showing["Screening Date"] === date)
      .sort((a, b) => a["Start Time"].localeCompare(b["Start Time"]));

    const now = new Date();

    const nextShowing = dateShowings.find((showing) => {
      const time = showing["Start Time"].slice(0, 8);
      return new Date(`${date}T${time}`) >= now;
    });

    setSelectedShowing(nextShowing ?? dateShowings[0] ?? null);
  }

  function bookShowing() {
    if (!selectedShowing) return;

    const bookingUrl = new URL("/booking", window.location.origin);

    bookingUrl.searchParams.set("show_id", selectedShowing.show_id);
    bookingUrl.searchParams.set("date", selectedShowing["Screening Date"]);
    bookingUrl.searchParams.set("time", selectedShowing["Start Time"]);

    window.location.href = bookingUrl.toString();
  }

  if (loading) {
    return <p>Laddar film...</p>;
  }

  if (!movie) {
    return <p>Filmen kunde inte hittas.</p>;
  }

  return (
    <main className="movie-detail">
      <TrailerPlayer trailerUrl={movie.trailerUrl} title={movie.title} />

      <h1>{movie.title}</h1>

      <p className="movie-detail__description">
        {movie.shortDescription}
        <br />
        {showFullDescription && movie.longDescription}{" "}
        <button
          className="movie-detail__description-toggle"
          type="button"
          onClick={() => setShowFullDescription((previous) => !previous)}
          aria-expanded={showFullDescription}
        >
          {showFullDescription ? "Visa mindre" : "Visa mer"}
        </button>
      </p>

      <section className="movie-detail__facts" aria-label="Filmfakta">
        <span>{movie.productionYear}</span>
        <span>{movie.ageRating} år</span>
        <span>{movie.language.original}</span>
        <span>{movie.duration} min</span>
        <span>Undertexter: {movie.language.subtitles}</span>
      </section>

      <section className="movie-detail__cast" aria-labelledby="cast-heading">
        <h2 id="cast-heading">Regissör och skådespelare</h2>

        <section
          className="movie-detail__cast-carousel"
          aria-label="Regissör och skådespelare"
        >
          {movie.director && (
            <article className="movie-detail__cast-card">
              <img
                src={getPersonImage(movie.director.image)}
                alt={movie.director.name}
              />
              <h3>{movie.director.name}</h3>
              <p>Regissör</p>
            </article>
          )}

          {movie.cast?.map((person) => (
            <article className="movie-detail__cast-card" key={person.id}>
              <img src={getPersonImage(person.image)} alt={person.name} />
              <h3>{person.name}</h3>
              <p>{person.character_name}</p>
            </article>
          ))}
        </section>
      </section>

      <section
        className="movie-detail__showtimes"
        aria-labelledby="showtimes-heading"
      >
        <h2 id="showtimes-heading">Visningstider</h2>

        {dates.length > 0 ? (
          <>
            <h3>Välj datum</h3>

            <nav className="movie-detail__dates" aria-label="Välj datum">
              {dates.map((date) => (
                <button
                  className="movie-detail__date"
                  key={date}
                  type="button"
                  onClick={() => selectDate(date)}
                  aria-pressed={selectedDate === date}
                >
                  {formatDate(date)}
                </button>
              ))}
            </nav>

            <h3>Välj visning</h3>

            {filteredShowings.length > 0 ? (
              <section
                className="movie-detail__times"
                aria-label="Tillgängliga visningar"
              >
                {filteredShowings.map((showing) => (
                  <button
                    className={`movie-detail__time ${
                      selectedShowing?.show_id === showing.show_id
                        ? "is-selected"
                        : ""
                    }`}
                    key={showing.show_id}
                    type="button"
                    onClick={() => setSelectedShowing(showing)}
                    aria-pressed={selectedShowing?.show_id === showing.show_id}
                  >
                    <span>{formatTime(showing["Start Time"])}</span>{" "}
                    <span>{showing.Screen}</span>
                  </button>
                ))}
              </section>
            ) : (
              <p>Inga visningar det här datumet.</p>
            )}

            <section className="movie-detail__booking" aria-live="polite">
              {selectedShowing && (
                <p>
                  {seatsLoading
                    ? "Hämtar platsinformation..."
                    : totalSeats > 0
                      ? `${bookedSeats} av ${totalSeats}`
                      : "Platsinformation saknas"}
                </p>
              )}

              <button
                className="movie-detail__book-button"
                type="button"
                disabled={!selectedShowing}
                onClick={bookShowing}
              >
                BOKA NU
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
