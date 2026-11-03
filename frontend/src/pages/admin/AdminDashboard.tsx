import type { CSSProperties } from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { MdMovie, MdPlayCircle, MdEvent, MdPeople } from "react-icons/md";
import { adminNav } from "./adminNav";
import { pages } from "../../routeConfig";

interface AdminMovie {
  id: string;
  title: string;
  release_date: string | null;
  end_date: string | null;
  created_at?: string;
}
interface Person {
  id: string;
}

const day = (d: string | null | undefined) => (d ? d.split("T")[0] : null);

function movieStatus(m: AdminMovie, today: string) {
  const start = day(m.release_date);
  const end = day(m.end_date);
  if (start && start > today) return { label: "Kommande", bg: "info" };
  if (end && end < today) return { label: "Avslutad", bg: "secondary" };
  if (start) return { label: "Visas nu", bg: "success" };
  return { label: "Utan datum", bg: "secondary" };
}

export default function AdminDashboard() {
  // Samma queryKeys som AdminMovies/AdminPersons – cachen delas och uppdateras
  // automatiskt när något sparas där.
  const { data: moviesData } = useQuery<AdminMovie[]>({
    queryKey: ["adminMovies"],
    queryFn: () => fetch("/api/movies/admin/all").then((res) => res.json()),
  });
  const { data: personsData } = useQuery<Person[]>({
    queryKey: ["persons"],
    queryFn: () => fetch("/api/persons").then((res) => res.json()),
  });

  const movies = Array.isArray(moviesData) ? moviesData : null;
  const persons = Array.isArray(personsData) ? personsData : null;

  const today = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD (lokal tid)
  const upcoming =
    movies?.filter((m) => (day(m.release_date) ?? "") > today).length ?? null;
  const current =
    movies?.filter((m) => {
      const s = day(m.release_date);
      const e = day(m.end_date);
      return !!s && s <= today && (!e || e >= today);
    }).length ?? null;

  const stats = [
    {
      label: "Filmer totalt",
      value: movies?.length,
      icon: MdMovie,
      tone: "#ef4444",
    },
    {
      label: "Visas just nu",
      value: current,
      icon: MdPlayCircle,
      tone: "#34d399",
    },
    { label: "Kommande", value: upcoming, icon: MdEvent, tone: "#60a5fa" },
    {
      label: "Personer",
      value: persons?.length,
      icon: MdPeople,
      tone: "#a78bfa",
    },
  ];

  const recentMovies = movies
    ? [...movies]
        .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
        .slice(0, 5)
    : [];

  const quickActions = adminNav.filter((item) => item.quickAction);

  return (
    <>
      {/* NYCKELTAL */}
      <section className="admin-stats" aria-label="Nyckeltal">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="admin-stat"
            style={{ "--tone": tone } as CSSProperties}
          >
            <span className="admin-stat-icon">
              <Icon size={26} aria-hidden="true" />
            </span>
            <div>
              <span className="admin-stat-label">{label}</span>
              <span className="admin-stat-value">{value ?? "–"}</span>
            </div>
          </div>
        ))}
      </section>

      {/* SENAST TILLAGDA FILMER */}
      <section className="admin-panel" aria-labelledby="recent-movies">
        <div className="admin-panel-header">
          <h2 id="recent-movies">Senast tillagda filmer</h2>
          <Link to={pages.adminMovies.path}>Visa alla</Link>
        </div>

        {!movies ? (
          <p className="text-secondary mb-0">Laddar filmer...</p>
        ) : recentMovies.length === 0 ? (
          <p className="text-secondary mb-0">Inga filmer registrerade ännu.</p>
        ) : (
          <ul className="admin-list list-unstyled mb-0">
            {recentMovies.map((m) => {
              const status = movieStatus(m, today);
              return (
                <li key={m.id}>
                  <span className="fw-semibold">{m.title}</span>
                  <span className="text-secondary small">
                    {day(m.release_date) ?? "Inget premiärdatum"}
                  </span>
                  <Badge bg={status.bg}>{status.label}</Badge>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* SNABBÅTGÄRDER – byggs från adminNav */}
      <section className="admin-panel" aria-labelledby="quick-actions">
        <div className="admin-panel-header">
          <h2 id="quick-actions">Snabbåtgärder</h2>
        </div>
        <div className="admin-quick-grid">
          {quickActions.map(({ key, path, icon: Icon, tone, quickAction }) => (
            <Link
              key={key}
              to={path}
              className="admin-quick"
              style={{ "--tone": tone } as CSSProperties}
            >
              <Icon size={34} aria-hidden="true" />
              <span className="admin-quick-title">{quickAction!.title}</span>
              <span className="admin-quick-hint">{quickAction!.hint}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
