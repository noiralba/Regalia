import type { Movies } from "../../types/types";
import { getMovieImage } from "../../utils/movieImages";
import { useState } from "react";

import './MovieRow.scss'

type MovieRowProps = {
  id?: string;
  label: string;
  movies: Movies[];
};

const PER_PAGE = 4;

export default function MovieRow({ id, label, movies }: MovieRowProps) {
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(movies.length / PER_PAGE);
  const visibleMovies = movies.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <section className="movie-row container" aria-labelledby={id}>
      <header className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-label h5 text-uppercase mb-0" id={id}>
          {label}
        </h2>

        {pageCount > 1 && (
          <nav aria-label={`Bläddra i ${label}`}>
            <button
              type="button"
              className="arrow-btn btn btn-outline-light btn-sm me-2"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              aria-label="Föregående sida"
            >
              ‹
            </button>
            <button
              type="button"
              className="arrow-btn btn btn-outline-light btn-sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pageCount - 1}
              aria-label="Nästa sida"
            >
              ›
            </button>
          </nav>
        )}
      </header>

      <ul className="row g-3 row-cols-2 row-cols-md-4 list-unstyled">
        {visibleMovies.map((movie) => (
          <li className="col" key={movie.id}>
            <figure className="poster">
              <img
                src={getMovieImage(movie.posterImage)}
                alt={movie.title}
                className="poster-image img-fluid rounded shadow-sm w-100"
              />
            </figure>
          </li>
        ))}
      </ul>

      {pageCount > 1 && (
        <nav className="dots" aria-label={`Sidor i ${label}`}>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              className={i === page ? "active" : undefined}
              onClick={() => setPage(i)}
              aria-label={`Sida ${i + 1} av ${pageCount}`}
              aria-current={i === page ? "true" : undefined}
            />
          ))}
        </nav>
      )}
    </section>
  );
}
