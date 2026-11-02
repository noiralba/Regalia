import type { MovieThumbnails } from "../../types/types";
import { getMovieImage } from "../../utils/getMovieImage";
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
  movies: MovieThumbnails[];
};

const MOBILE = "(max-width: 37.4375rem)";
const TABLET = "(min-width: 37.5rem) and (max-width: 64rem)";

function getPerPage() {
  if (window.matchMedia(MOBILE).matches) return 2;
  if (window.matchMedia(TABLET).matches) return 3;
  return 5;
}

function usePerPage() {
  const [perPage, setPerPage] = useState(getPerPage);

  useEffect(() => {
    const queries = [MOBILE, TABLET].map((q) => window.matchMedia(q));
    const update = () => setPerPage(getPerPage());
    queries.forEach((mq) => mq.addEventListener("change", update));
    return () =>
      queries.forEach((mq) => mq.removeEventListener("change", update));
  }, []);

  return perPage;
}

export default function MovieRow({ id, label, movies }: MovieRowProps) {
  const perPage = usePerPage();
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(movies.length / perPage);
  const safePage = Math.min(page, pageCount - 1);
  const visibleMovies = movies.slice(
    safePage * perPage,
    (safePage + 1) * perPage,
  );

  return (
    <section className="movie-row px-4" aria-labelledby={id}>
      <header className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="section-label text-uppercase mb-0" id={id}>
          {label}
        </h2>
      </header>

      <article className="carousel">
        <button
          type="button"
          className="arrow-btn"
          style={{ visibility: pageCount > 1 ? "visible" : "hidden" }}
          onClick={() => setPage(Math.max(safePage - 1, 0))}
          disabled={safePage === 0}
          aria-label="Föregående sida"
        >
          <MdOutlineArrowBackIos size={30} />
        </button>
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
                    <source media="(max-width: 767px)" srcSet={thumbnailUrl} />

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
        <button
          type="button"
          className="arrow-btn"
          style={{ visibility: pageCount > 1 ? "visible" : "hidden" }}
          onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
          disabled={safePage === pageCount - 1}
          aria-label="Nästa sida"
        >
          <MdOutlineArrowForwardIos size={30} />
        </button>
      </article>

      {pageCount > 1 && (
        <nav className="dots" aria-label={`Sidor i ${label}`}>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              className={i === safePage ? "active" : undefined}
              onClick={() => setPage(i)}
              aria-label={`Sida ${i + 1} av ${pageCount}`}
              aria-current={i === safePage ? "true" : undefined}
            />
          ))}
        </nav>
      )}
    </section>
  );
}
