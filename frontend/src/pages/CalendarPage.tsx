import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Calendar from "../components/Calender/Calender";
import DatePicker from "../components/Date-Picker/DatePicker";
import ThemeFilmStrip from "../components/ThemeFilmStrip/ThemeFilmStrip";

interface Movie {
  id: string;
  title: string;
  posterImage: string;
}

interface ThemeGroup {
  theme_id: string;
  theme_name: string;
  theme_description: string | null;
  movies: Movie[];
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toLocaleDateString("sv-SE"),
  );

  const { data: themeGroups } = useQuery<ThemeGroup[]>({
    queryKey: ["themesWithMovies"],
    queryFn: async () => {
      const res = await fetch("/api/themes/themes/with-movies");
      if (!res.ok) throw new Error("Kunde inte hämta temafilmer.");
      return res.json();
    },
  });

  return (
    <main className="page-container">
      <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
      <Calendar selectedDate={selectedDate} />

      <div className="themes-section mt-5">
        {themeGroups
          ?.filter((group) => group.movies.length > 0)
          .map((group) => (
            <ThemeFilmStrip
              key={group.theme_id}
              themeTitle={group.theme_name}
              themeDescription={group.theme_description || undefined}
              movies={group.movies}
            />
          ))}
      </div>
    </main>
  );
}
