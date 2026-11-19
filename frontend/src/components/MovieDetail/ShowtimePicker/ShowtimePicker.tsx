import type { Showing } from "../../../types/types";
import { formatTime } from "../../../utils/formatDateTime";

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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  function getDateLabel(dateString: string) {
    const date = new Date(`${dateString}T00:00:00`);

    if (date.getTime() === today.getTime()) {
      return "IDAG";
    }

    if (date.getTime() === tomorrow.getTime()) {
      return "IMORGON";
    }

    return date.toLocaleDateString("sv-SE", { weekday: "long" }).toUpperCase();
  }

  function getDateNumber(dateString: string) {
    return new Date(`${dateString}T00:00:00`).getDate();
  }

  return (
    <section className="showtime-picker" aria-labelledby="showtimes-heading">
      <h2 className="showtime-picker__heading" id="showtimes-heading">
        Välj datum
      </h2>

      <nav className="showtime-picker__dates" aria-label="Välj datum">
        {dates.map((date) => (
          <button
            className={`showtime-picker__date ${
              selectedDate === date ? "is-selected" : ""
            }`}
            key={date}
            type="button"
            onClick={() => onSelectDate(date)}
            aria-pressed={selectedDate === date}
          >
            <span className="showtime-picker__date-label">
              {getDateLabel(date)}
            </span>

            <span className="showtime-picker__date-number">
              {getDateNumber(date)}
            </span>
          </button>
        ))}
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
                className={`showtime-picker__time ${
                  isSelected ? "is-selected" : ""
                }`}
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
