// Component to display movie facts such as production year, age rating, language, duration, and subtitles.
import type { Movies } from "../../../types/types";
import "./MovieFacts.scss";

export default function MovieFacts({ movie }: { movie: Movies }) {
  return (
    <section className="movie-facts" aria-label="Filmfakta">
      <span>{movie.ageRating}+</span>
      <span>{movie.duration} min</span>
      <span>{movie.categories[0]}</span>
    </section>
  );
}
