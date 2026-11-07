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
          <div className="showing-info__poster">
            {movie && (
              <img
                src={getMovieImage(movie.posterImage)}
                alt={`Filmaffisch för ${movie.title}`}
              />
            )}
          </div>
          <div className="showing-info__details">
            <h3>{showing.Movie}</h3>
            <p>Datum: {showing["Screening Date"]}</p>
            <p>Tid: {showing["Start Time"]}</p>
            <p>Salong: {showing.Screen}</p>
          </div>
        </article>
      )}
    </section>
  );
}

export default ShowingInfo;
