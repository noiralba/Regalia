import { Badge } from "react-bootstrap";
import { Link } from "react-router";
import { pages } from "../../../routeConfig";
import type { AdminMovie } from "../shared/types";
import { day, movieStatus } from "./dashboardUtils";

type Props = {
  movies: AdminMovie[];
  isLoading: boolean;
  today: string;
};

// De fem senast tillagda filmerna
export default function RecentMovies({ movies, isLoading, today }: Props) {
  const recentMovies = [...movies]
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .slice(0, 5);

  return (
    <section className="admin-panel" aria-labelledby="recent-movies">
      <div className="admin-panel-header">
        <h2 id="recent-movies">Senast tillagda filmer</h2>
        <Link to={pages.adminMovies.path}>Visa alla</Link>
      </div>

      {isLoading ? (
        <p className="text-secondary mb-0">Laddar filmer...</p>
      ) : recentMovies.length === 0 ? (
        <p className="text-secondary mb-0">Inga filmer registrerade ännu.</p>
      ) : (
        <ul className="admin-list list-unstyled mb-0">
          {recentMovies.map((movie) => {
            const status = movieStatus(movie, today);
            return (
              <li key={movie.id}>
                <span className="fw-semibold">{movie.title}</span>
                <span className="text-secondary small">
                  {day(movie.release_date) ?? "Inget premiärdatum"}
                </span>
                <Badge bg={status.bg}>{status.label}</Badge>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
