import { useState } from "react";
import type { Movies } from "../../../types/types";
import "./MovieDescription.scss";

type Props = {
  movie: Movies;
  shortDescription: string;
  longDescription?: string;
};

export default function MovieDescription({
  movie,
  shortDescription,
  longDescription,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  //Split the long description into paragraphs, filtering out any empty paragraphs
  const paragraphs = longDescription
    ? longDescription.split("\n").filter((paragraph) => paragraph.trim() !== "")
    : [];

  return (
    <section className="movie-description" aria-label="Filmbeskrivning">
      <h1 className="movie-description__title">{movie.title}</h1>

      <p className="movie-description__text">{shortDescription}</p>

      {expanded &&
        paragraphs.map((paragraph, index) => (
          <p key={index} className="movie-description__text">
            {paragraph}
          </p>
        ))}

      {longDescription && (
        <button
          className="movie-description__toggle"
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? "Visa mindre" : "Visa mer"}
        </button>
      )}
    </section>
  );
}
