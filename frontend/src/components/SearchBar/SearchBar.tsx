import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../Admin/shared/api";
import { queryKeys } from "../Admin/shared/queryKeys";
import { toStringArray } from "../Admin/shared/parse";

interface MovieSearchResult {
  movie_id: string;
  title: string;
  release_date: string;
  end_date: string;
  ageRating: string;
  shortDescription: string;
  longDescription: string;
  categories: string[];
}

const fetchFilteredMovies = async (
  search: string,
  category: string,
  ageRating: string,
): Promise<MovieSearchResult[]> => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.set("search", search);
  if (category) queryParams.set("categories", category);
  if (ageRating) queryParams.set("ageRating", ageRating);

  return api.get<MovieSearchResult[]>(`/api/movies?${queryParams.toString()}`);
};

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("categories") || "";
  const ageQuery = searchParams.get("ageRating") || "";

  const [localSearch, setLocalSearch] = useState(() => searchQuery);

  // Debounce för sökfältet
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => {
        if (localSearch.length >= 2) {
          prev.set("search", localSearch);
        } else {
          prev.delete("search");
        }
        return prev;
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchParams]);

  const currentFilters = {
    search: searchQuery,
    categories: categoryQuery,
    ageRating: ageQuery,
  };

  const {
    data: movies,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: queryKeys.publicMovieSearch(currentFilters),
    queryFn: () => fetchFilteredMovies(searchQuery, categoryQuery, ageQuery),
    enabled: searchQuery.length >= 2 || categoryQuery !== "" || ageQuery !== "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      return prev;
    });
  };

  const handleMovieClick = (movieId: string) => {
    navigate(`/filmer/${movieId}`);

    setLocalSearch("");
    setSearchParams((prev) => {
      prev.delete("search");
      return prev;
    });
  };

  return (
    <section aria-label="Filmsökning">
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="movie-search">Sök efter film</label>
        <input
          id="movie-search"
          type="search"
          placeholder="Sök på ålder, genre eller sökord"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />

        <label htmlFor="age-filter">Filtrera efter ålder</label>
        <select
          id="age-filter"
          value={ageQuery}
          onChange={(e) => handleFilterChange("ageRating", e.target.value)}
        >
          <option value="">Alla åldrar</option>
          <option value="0">Barntillåten (0 år)</option>
          <option value="7">7 år</option>
          <option value="11">11 år</option>
          <option value="15">15 år</option>
        </select>
      </form>

      {(localSearch.length >= 2 || ageQuery !== "" || categoryQuery !== "") && (
        <section aria-label="Sökresultat">
          {isLoading && <p role="status">Söker...</p>}

          {isError && <p role="alert">{error.message}</p>}

          {movies && movies.length === 0 && (
            <p>Inga filmer matchade din sökning.</p>
          )}

          {movies && movies.length > 0 && (
            <ul>
              {movies.map((movie) => {
                const parsedCategories = toStringArray(movie.categories);

                return (
                  <li key={movie.movie_id}>
                    <button
                      type="button"
                      onClick={() => handleMovieClick(movie.movie_id)}
                    >
                      <span>{movie.title}</span>
                      <span>
                        {movie.ageRating ? `${movie.ageRating} år` : "U"} •{" "}
                        {parsedCategories.join(", ")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </section>
  );
}
