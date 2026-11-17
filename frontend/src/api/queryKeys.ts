/**
 * Alla React Query-nycklar på ett ställe.
 * Samma nyckel = samma cache. När något sparas "invalideras" nycklarna som
 * påverkas, så att listorna hämtas på nytt.
 */
export const queryKeys = {
  publicMovieSearch: (filters: {
    search: string;
    categories: string;
    ageRating: string;
  }) => ["publicMovieSearch", filters],
  publicMovie: (movieId: string) => ["movie", movieId],
} as const;
