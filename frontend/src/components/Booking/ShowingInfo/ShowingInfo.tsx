import type { Movies, MovieScreening } from "../../../types/types";
import { getMovieImage } from "../../../utils/getMovieImage";
import "./ShowingInfo.scss";

interface ShowingInfoProps {
  showing: MovieScreening | null;
  movie: Movies | null;
  hasError: boolean;
}

function ShowingInfo({ showing, movie, hasError }: ShowingInfoProps) {
  return (
    <section className="showing-info">
      <h2>Vald film</h2>
      {!showing && !hasError && <p>Hämtar visning...</p>}
      {showing && (
        <article className="showing-info__movie">
          <figure className="showing-info__poster">
            {movie && (
              <img
                src={getMovieImage(movie.posterImage)}
                alt={`Filmaffisch för ${movie.title}`}
              />
            )}
          </figure>
          <figure className="showing-info__details">
            <h3>{showing.Movie}</h3>
            <dl className="showing-info__meta">
              <div>
                <dt>Datum</dt>
                <dd>{showing["Screening Date"]}</dd>
              </div>
              <div>
                <dt>Tid</dt>
                <dd>{showing["Start Time"]}</dd>
              </div>
              <div>
                <dt>Salong</dt>
                <dd>{showing.Screen}</dd>
              </div>
            </dl>
          </figure>
        </article>
      )}
    </section>
  );
}

export default ShowingInfo;
