// Component to display a movie's description with an option to expand or collapse the long description.
import { useState } from "react";
import type { Movies } from "../../../types/types";
import "./MovieDescription.scss";

type Props = {
  movie: Movies;
  shortDescription: string; longDescription?: string;
};

export default function MovieDescription({
  movie,
  shortDescription,
  longDescription,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="movie-description"
      aria-label="Filmbeskrivning"
    >
      <h1 className="movie-description__title">{movie.title}</h1>
      <p className="movie-description__text" aria-label="Filmbeskrivning">
        {shortDescription}
        {expanded && longDescription}{" "}
        <button
          className="movie-description__toggle"
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? "Visa mindre" : "Visa mer"}
        </button>
      </p>
    </section>
  );
}
