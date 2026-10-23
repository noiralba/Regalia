import type { Movies } from '../types/types'
import { getMovieImage } from '../utils/movieImages';

interface MovieRowProps {
  label: string
  movies: Movies[]
}

export default function MovieRow({ label, movies }: MovieRowProps) {
  return (
    <section className="movie-row">
      <article className="container">
        <p className="section-label h5 text-uppercase mb-3">{label}</p>
        <article className="row g-3 row-cols-2 row-cols-md-4">
          {movies.map((movie) => (
            <article className="col" key={movie.id}>
              <article className="poster">
                <img
                  src={getMovieImage(movie.posterImage)}
                  alt={movie.title}
                  className="poster-image img-fluid rounded shadow-sm w-100"
                />
                <p className="cap h5 text-uppercase mb-3">{movie.title}</p>
              </article>
            </article>
          ))}
        </article>
        <p className="dots">
          <span className="active" />
          <span />
          <span />
        </p>
      </article>
    </section>
  )
}