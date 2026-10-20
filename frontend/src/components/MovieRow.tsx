import type { Movies } from '../types/types'
import { getMovieImage } from '../utils/movieImages';

interface MovieRowProps {
  label: string
  movies: Movies[]
}

export default function MovieRow({ label, movies }: MovieRowProps) {
  return (
    <section className="movie-row">
      <div className="container">
        <div className="section-label h5 text-uppercase mb-3">{label}</div>
        <div className="row g-3 row-cols-2 row-cols-md-4">
          {movies.map((movie) => (
            <div className="col" key={movie.id}>
              <div className="poster">
                <img
                  src={getMovieImage(movie.posterImage)}
                  alt={movie.title}
                  className="poster-image img-fluid rounded shadow-sm w-100"
                />
                <div className="cap h5 text-uppercase mb-3">{movie.title}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="dots">
          <span className="active" />
          <span />
          <span />
        </div>
      </div>
    </section>
  )
}