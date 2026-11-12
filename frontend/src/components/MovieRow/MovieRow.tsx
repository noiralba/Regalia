import type { MovieThumbnails } from "../../types/types";
import { getMovieImage } from "../../utils/getMovieImage";
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
  return (
    <section className="movie-row" aria-labelledby={id}>
      <header className="mb-3">
        <h2 className="section-label text-uppercase mb-0" id={id}>
          {label}
        </h2>
      </header>

      <section className="movie-carousel" aria-label={`Filmer: ${label}`}>
        {/* <button
          type="button"
          className="arrow-btn arrow-prev"
          aria-label="Föregående"
        >
          <MdOutlineArrowBackIos size={30} />
        </button> */}

        <ul className="grid-movies list-unstyled">
          {movies.map((movie) => {
            const thumbnailUrl = getMovieImage(
              movie.posterThumbnail,
              "thumbnail",
            );
            const posterUrl = getMovieImage(movie.posterThumbnail, "poster");

            return (
              <li className="col poster" key={movie.movie_id}>
                <Link
                  to={`/filmer/${slugify(movie.title)}-${movie.movie_id}`}
                  aria-label={`Visa information om ${movie.title}`}
                >
                  <figure className="poster-figure m-0">
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

        {/* <button
          type="button"
          className="arrow-btn arrow-next"
          aria-label="Nästa"
        >
          <MdOutlineArrowForwardIos size={30} />
        </button> */}
      </section>
    </section>
  );
}
