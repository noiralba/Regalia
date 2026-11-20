import { MdEvent, MdMovie, MdPeople, MdPlayCircle } from "react-icons/md";
import { useAdminMovies, usePersons } from "../shared/useAdminQueries";
import { countCurrentAndUpcoming, todayString } from "./dashboardUtils";
import QuickActions from "./QuickActions";
import RecentMovies from "./RecentMovies";
import StatCards from "./StatCards";
import type { Stat } from "./StatCards";

export default function AdminDashboard() {
  // Samma data (och cache) som filmer- och personsidorna, så siffrorna är alltid aktuella
  const { movies, isLoading: moviesLoading } = useAdminMovies();
  const { persons, isLoading: personsLoading } = usePersons();

  const today = todayString();
  const { current, upcoming } = countCurrentAndUpcoming(movies, today);

  const stats: Stat[] = [
    { label: "Filmer totalt", value: moviesLoading ? undefined : movies.length, icon: MdMovie, tone: "#ef4444" },
    { label: "Visas just nu", value: moviesLoading ? undefined : current, icon: MdPlayCircle, tone: "#34d399" },
    { label: "Kommande", value: moviesLoading ? undefined : upcoming, icon: MdEvent, tone: "#60a5fa" },
    { label: "Personer", value: personsLoading ? undefined : persons.length, icon: MdPeople, tone: "#a78bfa" },
  ];

  return (
    <>
      <StatCards stats={stats} />
      <RecentMovies movies={movies} isLoading={moviesLoading} today={today} />
      <QuickActions />
    </>
  );
}
