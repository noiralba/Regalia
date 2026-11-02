// Component to display a carousel of the movie's director and cast members.
import type { Movies } from "../../types/types";
import { getPersonImage } from "../../utils/personImages";

export default function CastCarousel({ movie }: { movie: Movies }) {
  return (
    <section className="movie-detail__cast" aria-labelledby="cast-heading">
      <h2 id="cast-heading">Regissör och skådespelare</h2>

      <section
        className="movie-detail__cast-carousel"
        aria-label="Regissör och skådespelare"
      >
        {movie.director && (
          <article className="movie-detail__cast-card">
            <img
              src={getPersonImage(movie.director.image)}
              alt={movie.director.name}
            />
            <h3>{movie.director.name}</h3>
            <p>Regissör</p>
          </article>
        )}

        {movie.cast?.map((person) => (
          <article className="movie-detail__cast-card" key={person.id}>
            <img src={getPersonImage(person.image)} alt={person.name} />
            <h3>{person.name}</h3>
            <p>{person.character_name}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
