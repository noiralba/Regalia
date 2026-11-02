import type { Movies } from "../../types/types";
import { getMovieImage } from "../../utils/movieImages";
import { useState } from "react";
import { Link } from "react-router";
import { slugify } from "../../utils/slugify";

import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

import "./MovieRow.scss";

type MovieRowProps = {
  id?: string;
  label: string;
  movies: Movies[];
};

const PER_PAGE = 5;

export default function MovieRow({ id, label, movies }: MovieRowProps) {
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(movies.length / PER_PAGE);
  const visibleMovies = movies.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <section className="movie-row" aria-labelledby={id}>
      <header className="mb-3">
        <h2 className="section-label text-uppercase mb-0" id={id}>
          {label}
        </h2>
      </header>

      <section className="movie-carousel" aria-label={`Filmer: ${label}`}>
        <button
          type="button"
          className="arrow-btn arrow-prev"
          style={{ visibility: pageCount > 1 ? "visible" : "hidden" }}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          aria-label="Föregående sida"
        >
          <MdOutlineArrowBackIos size={30} />
        </button>

        <ul className="grid-movies list-unstyled">
          {visibleMovies.map((movie) => (
            <li className="col" key={movie.id}>
              <Link
                to={`/filmer/${slugify(movie.title)}-${movie.id}`}
                aria-label={`Visa information om ${movie.title}`}
              >
                <figure className="poster">
                  <img
                    src={getMovieImage(movie.posterImage)}
                    alt={movie.title}
                    className="poster-image img-fluid rounded shadow-sm w-100"
                  />

                  <span
                    className="age-badge"
                    aria-label={`Åldersgräns ${movie.ageRating} år`}
                  >
                    {movie.ageRating === 0 ? "Btl" : movie.ageRating}+
                  </span>
                </figure>
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="arrow-btn arrow-next"
          style={{ visibility: pageCount > 1 ? "visible" : "hidden" }}
          onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
          disabled={page === pageCount - 1}
          aria-label="Nästa sida"
        >
          <MdOutlineArrowForwardIos size={30} />
        </button>
      </section>

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
