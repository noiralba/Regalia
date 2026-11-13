// Component to allow users to select a date and a showing time for a movie. It displays available dates and corresponding showings, allowing users to select one of each. The selected date and showing are highlighted, and callbacks are provided for when selections change.
import type { Showing } from "../../../types/types";
import { formatDate, formatTime } from "../../../utils/formatDateTime";

import "./ShowtimePicker.scss";

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
    <section className="showtime-picker" aria-labelledby="showtimes-heading">
      <h2 className="showtime-picker__heading">Välj datum</h2>
      <nav className="showtime-picker__dates" aria-label="Välj datum">
        {dates.map((date) => {
          const { dateText, weekdayText } = formatDate(date);
          return (
            <button
              className="showtime-picker__date"
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
              aria-pressed={selectedDate === date}
            >
              <span className="showtime-picker__date-day">{dateText}</span>
              <span className="showtime-picker__date-weekday">
                {weekdayText}
              </span>
            </button>
          );
        })}
      </nav>

      <h2 className="showtime-picker__heading">Välj visning</h2>
      {showings.length > 0 ? (
        <section
          className="showtime-picker__times"
          aria-label="Tillgängliga visningar"
        >
          {showings.map((showing) => {
            const isSelected = selectedShowing?.show_id === showing.show_id;
            return (
              <button
                className={`showtime-picker__time ${isSelected ? "is-selected" : ""}`}
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
    </section>
  );
}
