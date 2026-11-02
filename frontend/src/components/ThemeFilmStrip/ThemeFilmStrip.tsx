// import React from "react";
import { Link } from "react-router";
import { getMovieImage } from "../../utils/getMovieImage";
import { slugify } from "../../utils/slugify";
import "./ThemeFilmStrip.scss";

interface Movies {
  id: string;
  title: string;
  posterImage: string;
}

interface ThemeFilmStripProps {
  themeTitle: string;
  themeDescription?: string;
  movies: Movies[];
}

export default function ThemeFilmStrip({
  themeTitle,
  themeDescription,
  movies,
}: ThemeFilmStripProps) {
  return (
    <section className="theme-filmstrip" aria-label={`Tema ${themeTitle}`}>
      <div className="container">
        <header className="theme-filmstrip__header mb-4">
          <h2 className="theme-filmstrip__title">{themeTitle}</h2>
          {themeDescription && (
            <span className="theme-filmstrip__description text-muted ms-3">
              {themeDescription}
            </span>
          )}
        </header>

        <div className="theme-filmstrip__strip-wrapper">
          <ul className="theme-filmstrip__strip list-unstyled">
            {movies.map((movie) => (
              <li className="theme-filmstrip__item" key={movie.id}>
                <Link
                  to={`/filmer/${slugify(movie.title)}-${movie.id}`}
                  className="theme-filmstrip__link"
                  aria-label={`Visa information om ${movie.title}`}
                >
                  <figure className="theme-filmstrip__poster mb-0">
                    <img
                      src={getMovieImage(movie.posterImage)}
                      alt={movie.title}
                      className="theme-filmstrip__image img-fluid"
                    />
                  </figure>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
