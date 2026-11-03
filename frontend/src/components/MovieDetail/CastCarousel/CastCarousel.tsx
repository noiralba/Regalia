// Component to display a carousel of the movie's director and cast members.
import type { Movies } from "../../../types/types";
import { getPersonImage } from "../../../utils/personImages";
import "./CastCarousel.scss";

export default function CastCarousel({ movie }: { movie: Movies }) {
  return (
    <section className="cast-carousel" aria-labelledby="cast-heading">
      <h2 className="cast-carousel__heading" id="cast-heading">
        Rollista
      </h2>

      <section
        className="cast-carousel__content"
        aria-label="Regissör och skådespelare"
      >
        {movie.director && (
          <article className="cast-carousel__card">
            <img
              src={getPersonImage(movie.director.image)}
              alt={movie.director.name}
            />
            <h3>{movie.director.name}</h3>
            <p>Regissör</p>
          </article>
        )}

        {movie.cast?.map((person) => (
          <article className="cast-carousel__card" key={person.id}>
            <img src={getPersonImage(person.image)} alt={person.name} />
            <h3>{person.name}</h3>
            <p>{person.character_name}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
