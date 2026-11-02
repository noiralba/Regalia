// Component to display a movie's description with an option to expand or collapse the long description.
import { useState } from "react";

type Props = { shortDescription: string; longDescription?: string };

export default function MovieDescription({
  shortDescription,
  longDescription,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <p className="movie-detail__description">
      {shortDescription}
      <br />
      {expanded && longDescription}{" "}
      <button
        className="movie-detail__description-toggle"
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        {expanded ? "Visa mindre" : "Visa mer"}
      </button>
    </p>
  );
}
