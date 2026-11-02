// Component to allow users to select a date and a showing time for a movie. It displays available dates and corresponding showings, allowing users to select one of each. The selected date and showing are highlighted, and callbacks are provided for when selections change.
import type { Showing } from "../../types/types";
import { formatDate, formatTime } from "../../utils/formatDateTime";

type Props = {
  dates: string[];
  showings: Showing[]; 
  selectedDate: string | null;
  selectedShowing: Showing | null;
  onSelectDate: (date: string) => void;
  onSelectShowing: (showing: Showing) => void;
};

export default function ShowtimePicker({
  dates,
  showings,
  selectedDate,
  selectedShowing,
  onSelectDate,
  onSelectShowing,
}: Props) {
  return (
    <>
      <h3>Välj datum</h3>
      <nav className="movie-detail__dates" aria-label="Välj datum">
        {dates.map((date) => (
          <button
            className="movie-detail__date"
            key={date}
            type="button"
            onClick={() => onSelectDate(date)}
            aria-pressed={selectedDate === date}
          >
            {formatDate(date)}
          </button>
        ))}
      </nav>

      <h3>Välj visning</h3>
      {showings.length > 0 ? (
        <section
          className="movie-detail__times"
          aria-label="Tillgängliga visningar"
        >
          {showings.map((showing) => {
            const isSelected = selectedShowing?.show_id === showing.show_id;
            return (
              <button
                className={`movie-detail__time ${isSelected ? "is-selected" : ""}`}
                key={showing.show_id}
                type="button"
                onClick={() => onSelectShowing(showing)}
                aria-pressed={isSelected}
              >
                <span>{formatTime(showing["Start Time"])}</span>
              </button>
            );
          })}
        </section>
      ) : (
        <p>Inga visningar det här datumet.</p>
      )}
    </>
  );
}
