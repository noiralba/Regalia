import { useEffect, useState, useMemo } from "react";
import { get } from "../../api/api";
import type { MovieScreening, Movies } from "../../types/types";
import { useNavigate } from "react-router";

type ShowingWithInfo = MovieScreening & {
  categories: string;
  ageRating?: Movies["ageRating"];
  duration?: Movies["duration"];
};

type CalendarProps = {
  selectedDate: string;
};

export default function Calendar({ selectedDate }: CalendarProps) {
  const [showings, setShowings] = useState<MovieScreening[]>([]);
  const [movies, setMovies] = useState<Movies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function formatSelectedDate(dateString: string) {
    const todayString = new Date().toLocaleDateString("sv-SE");

    if (dateString === todayString) return "Visas idag";

    const date = new Date(`${dateString}T00:00`);

    const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" });
    const dayAndMonth = date
      .toLocaleDateString("sv-SE", { day: "numeric", month: "short" })
      .replace(".", "");

    return `${weekday} ${dayAndMonth}`;
  }

  // Hämta filmer en gång
  useEffect(() => {
    let cancelled = false;

    get<Movies[]>("/api/movies")
      .then((data) => {
        if (!cancelled) {
          setMovies(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Kunde inte hämta filmer.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Hämta visningar när datumet ändras
  useEffect(() => {
    let cancelled = false;

    async function fetchShowings() {
      setLoading(true);
      setError("");

      try {
        const data = await get<MovieScreening[]>(
          `/api/shows?date=${encodeURIComponent(selectedDate)}`,
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

  // Koppla varje visning till filmens information
  const showingsWithInfo: ShowingWithInfo[] = useMemo(() => {
    const movieByTitle = new Map(movies.map((movie) => [movie.title, movie]));

    return showings.map((showing) => {
      const movie = movieByTitle.get(showing.Movie);

      return {
        ...showing,
        categories: movie?.categories?.[0] ?? "Okänd kategori",
        ageRating: movie?.ageRating,
        duration: movie?.duration,
      };
    });
  }, [showings, movies]);

  // Gruppera visningarna efter film
  const groupedShowings = useMemo(() => {
    const groups = new Map<MovieScreening["movie_id"], ShowingWithInfo[]>();

    for (const show of showingsWithInfo) {
      const list = groups.get(show.movie_id) ?? [];

      list.push(show);
      groups.set(show.movie_id, list);
    }

    return [...groups.values()];
  }, [showingsWithInfo]);

  return (
    <section className="calender container my-5">
      <header className="mb-3">
        <h2 className="h5 text-uppercase">
          {formatSelectedDate(selectedDate)}
        </h2>
      </header>

      {loading ? (
        <p>Laddar visningar...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : showingsWithInfo.length === 0 ? (
        <p>Inga visningar för detta datum.</p>
      ) : (
        <section className="schedule-box border rounded-2 p-3 p-md-4">
          {groupedShowings.map((group) => {
            const movie = group[0];

            return (
              <article
                className="row align-items-center g-3 py-2"
                key={movie.movie_id}
              >
                <header className="col-12 col-md-4">
                  <h3 className="movie-title text-uppercase fw-bold fs-6">
                    {movie.Movie}
                  </h3>

                  <p className="mb-0">
                    <small>
                      {movie.categories}
                      {movie.ageRating != null && ` | ${movie.ageRating}+`}
                      {movie.duration != null && ` | ${movie.duration} min`}
                    </small>
                  </p>
                </header>

                <ul className="col-12 col-md-8 list-unstyled d-flex flex-column gap-2 mb-0">
                  {group.map((show) => (
                    <li key={show.show_id}>
                      <button
                        type="button"
                        className="time-btn btn border rounded-2 py-2 px-3 text-center w-100"
                      >
                        <time className="fw-semibold d-block">
                          {show["Start Time"]}
                        </time>

                        <small className="d-block">{show.Screen}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}

          <footer className="row g-0 mt-3">
            <section className="col-12 col-md-8 offset-md-4">
              <button
                onClick={() => navigate("/kalender")}
                type="button"
                className="btn border rounded-2 w-100 py-2 text-uppercase fw-semibold"
              >
                Se fler datum
              </button>
            </section>
          </footer>
        </section>
      )}
    </section>
  );
}
