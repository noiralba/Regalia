import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import { queryKeys } from "./queryKeys";
import { parseJson } from "./parse";
import type {
  AdminMovie,
  CastMember,
  Category,
  DirectorSummary,
  MovieDetailsResponse,
  Person,
  Screen,
  Show,
  Theme,
} from "./types";

/**
 * ALL datahämtning (GET) för admin finns här. Varje hook returnerar en lista
 * (tom medan den laddas) och isLoading, så sidorna slipper hantera undefined.
 */

export function useAdminMovies() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminMovies,
    queryFn: () => api.get<AdminMovie[]>("/api/movies/admin/all"),
  });
  return { movies: data ?? [], isLoading };
}

export function usePersons() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.persons,
    queryFn: () => api.get<Person[]>("/api/persons"),
  });
  return { persons: data ?? [], isLoading };
}

export function useCategories() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => api.get<Category[]>("/api/categories"),
  });
  return { categories: data ?? [], isLoading };
}

export function useScreens() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.screens,
    queryFn: () => api.get<Screen[]>("/api/screens"),
  });
  return { screens: data ?? [], isLoading };
}

export function useAdminShows() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminShows,
    queryFn: () => api.get<Show[]>("/api/shows/admin/all"),
  });
  return { shows: data ?? [], isLoading };
}

export function useAdminThemes() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminThemes,
    queryFn: () => api.get<Theme[]>("/api/themes/admin/all"),
  });
  return { themes: data ?? [], isLoading };
}

// Regissör och rollista för en vald film. Hämtas först när en film är vald.
export function useMovieDetails(movieId: string) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.movieDetails(movieId),
    queryFn: () => api.get<MovieDetailsResponse>(`/api/movies/${movieId}`),
    enabled: !!movieId,
  });

  const director = parseJson<DirectorSummary | null>(data?.director, null);
  const cast = parseJson<CastMember[]>(data?.cast, [])
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, "sv"));

  return { isLoaded: !!data, isLoading, director, cast };
}
