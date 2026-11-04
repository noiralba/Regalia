/**
 * Alla React Query-nycklar på ett ställe.
 * Samma nyckel = samma cache. När något sparas "invalideras" nycklarna som
 * påverkas, så att listorna hämtas på nytt.
 */
export const queryKeys = {
  // Adminvyer
  adminMovies: ["adminMovies"],
  adminShows: ["adminShows"],
  adminThemes: ["adminThemes"],
  persons: ["persons"],
  categories: ["categories"],
  screens: ["screens"],
  movieDetails: (movieId: string) => ["adminMovieDetails", movieId],

  // Nycklar som den publika webbplatsen använder (invalideras så att den visar färsk data)
  publicShows: ["shows"],
  publicThemes: ["themes"],
  publicMovie: (movieId: string) => ["movie", movieId],
} as const;
