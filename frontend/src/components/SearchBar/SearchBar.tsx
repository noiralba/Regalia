import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../Admin/shared/api";
import { queryKeys } from "../Admin/shared/queryKeys";
import { toStringArray } from "../Admin/shared/parse";
import "./SearchBar.scss";

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

  if (search) queryParams.set("sök", search);
  if (category) queryParams.set("kategorier", category);
  if (ageRating) queryParams.set("åldersgräns", ageRating);

  return api.get<MovieSearchResult[]>(`/api/movies?${queryParams.toString()}`);
};

export default function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const searchQuery = searchParams.get("sök") || "";
  const categoryQuery = searchParams.get("kategorier") || "";
  const ageQuery = searchParams.get("åldersgräns") || "";

  const [localSearch, setLocalSearch] = useState(() => searchQuery);
  const [ageMenuOpen, setAgeMenuOpen] = useState(false);
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  const searchBarRef = useRef<HTMLElement>(null);

  const ageOptions = [
    { value: "", label: "ALLA ÅLDRAR" },
    { value: "0", label: "Barntillåten (0 år)" },
    { value: "7", label: "7 år" },
    { value: "11", label: "11 år" },
    { value: "15", label: "15 år" },
  ];

  const selectedAge =
    ageOptions.find((option) => option.value === ageQuery)?.label ||
    "ALLA ÅLDRAR";

  // Stäng båda menyerna vid klick utanför eller Escape
  useEffect(() => {
    if (!ageMenuOpen && !searchResultsOpen) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setAgeMenuOpen(false);
        setSearchResultsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAgeMenuOpen(false);
        setSearchResultsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [ageMenuOpen, searchResultsOpen]);

  // Fördröj sökningen med 300 ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => {
        if (localSearch.length >= 2) {
          prev.set("sök", localSearch);
        } else {
          prev.delete("sök");
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
  };

  return (
    <section className="search-bar" aria-label="Filmsökning" ref={searchBarRef}>
      <form className="search-bar-form" onSubmit={(e) => e.preventDefault()}>
        <section className="search-field">
          <label htmlFor="movie-search">Sök efter film</label>

          <input
            className="search-input"
            id="movie-search"
            type="search"
            autoComplete="off"
            placeholder="Ålder, genre eller sökord"
            value={localSearch}
            onFocus={() => setSearchResultsOpen(true)}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setSearchResultsOpen(true);
            }}
          />
        </section>

        <section className="age-filter">
          <button
            type="button"
            className="age-trigger"
            aria-expanded={ageMenuOpen}
            aria-haspopup="true"
            onClick={() => {
              setAgeMenuOpen((open) => !open);
              setSearchResultsOpen(true);
            }}
          >
            <span>{selectedAge}</span>

            <span
              className={`age-arrow ${ageMenuOpen ? "age-arrow-open" : ""}`}
              aria-hidden="true"
            />
          </button>

          {ageMenuOpen && (
            <section className="age-dropdown" aria-label="Välj åldersgräns">
              {ageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`age-option ${
                    ageQuery === option.value ? "age-option-active" : ""
                  }`}
                  onClick={() => {
                    handleFilterChange("åldersgräns", option.value);
                    setAgeMenuOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </section>
          )}
        </section>
      </form>

      {searchResultsOpen &&
        (localSearch.length >= 2 ||
          ageQuery !== "" ||
          categoryQuery !== "") && (
          <section className="search-results" aria-label="Sökresultat">
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
