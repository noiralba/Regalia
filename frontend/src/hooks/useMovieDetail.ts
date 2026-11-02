// A custom hook to fetch movie details and showings based on a given movie ID.
import { useEffect, useState } from "react";
import { get, getById } from "../api/api";
import type { Movies, Showing } from "../types/types";

export function useMovieDetail(id?: string) {
  const [movie, setMovie] = useState<Movies | null>(null);
  const [showings, setShowings] = useState<Showing[]>([]);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Kunde inte hämta filmen eller visningarna:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMovie();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { movie, showings, loading };
}