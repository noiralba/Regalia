// Component to display movie facts such as production year, age rating, language, duration, and subtitles.
import type { Movies } from "../../types/types";

export default function MovieFacts({ movie }: { movie: Movies }) {
  return (
    <section className="movie-detail__facts" aria-label="Filmfakta">
      <span>{movie.productionYear}</span>
      <span>{movie.ageRating} år</span>
      <span>{movie.language.original}</span>
      <span>{movie.duration} min</span>
      <span>Undertexter: {movie.language.subtitles}</span>
    </section>
  );
}
