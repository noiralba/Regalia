import type { MovieThumbnails } from "../../types/types";
import { getMovieImage } from "../../utils/getMovieImage";
import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
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
  movies: MovieThumbnails[];
};

export default function MovieRow({ id, label, movies }: MovieRowProps) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 1024 ? 3 : 5,
  );
  const [prevPerPage, setPrevPerPage] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 1024 ? 3 : 5,
  );

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const updatePerPage = () => {
      setPerPage(window.innerWidth <= 1024 ? 3 : 5);
    };

    window.addEventListener("resize", updatePerPage);

    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  if (perPage !== prevPerPage) {
    setPrevPerPage(perPage);
    setPage(0);
  }

  const pageCount = Math.ceil(movies.length / perPage);
  const visibleMovies = movies.slice(page * perPage, (page + 1) * perPage);

  const handleTouchStart = (e: TouchEvent<HTMLElement>) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLElement>) => {
    touchEndX.current = e.changedTouches[0].screenX;

    const difference = touchStartX.current - touchEndX.current;

    if (Math.abs(difference) < 50) return;

    if (difference > 0) {
      setPage((p) => Math.min(p + 1, pageCount - 1));
    } else {
      setPage((p) => Math.max(p - 1, 0));
    }
  };

  return (
    <section className="movie-row" aria-labelledby={id}>
      <header className="mb-3">
        <h2 className="section-label text-uppercase mb-0" id={id}>
          {label}
        </h2>
      </header>

      <section
        className="movie-carousel"
        aria-label={`Filmer: ${label}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
          {visibleMovies.map((movie) => {
            const thumbnailUrl = getMovieImage(
              movie.posterThumbnail,
              "thumbnail",
            );
            const posterUrl = getMovieImage(movie.posterThumbnail, "poster");

            return (
              <li className="col" key={movie.movie_id}>
                <Link
                  to={`/filmer/${slugify(movie.title)}-${movie.movie_id}`}
                  aria-label={`Visa information om ${movie.title}`}
                >
                  <figure className="poster">
                    <picture>
                      <source
                        media="(max-width: 767px)"
                        srcSet={thumbnailUrl}
                      />

                      <img
                        src={posterUrl}
                        alt={movie.title}
                        loading="lazy"
                        className="poster-image img-fluid rounded shadow-sm w-100"
                      />
                    </picture>

                    <span
                      className="age-badge"
                      aria-label={`Åldersgräns ${movie.ageRating} år`}
                    >
                      {movie.ageRating === 0 ? "Btl" : movie.ageRating}+
                    </span>

                    <figcaption className="poster-overlay">
                      <span className="poster-title">{movie.title}</span>
                    </figcaption>
                  </figure>
                </Link>
              </li>
            );
          })}
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
