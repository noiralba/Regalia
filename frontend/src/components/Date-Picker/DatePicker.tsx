import { useState } from "react";
import "./DatePicker.scss"

type DatePickerProps = {
  selectedDate: string;
  onSelect: (date: string) => void;
  daysVisible?: number;
};

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export default function DatePicker({
  selectedDate,
  onSelect,
  daysVisible = 7,
}: DatePickerProps) {
  const [today] = useState(() => new Date());
  const [startDate, setStartDate] = useState(today);

  const days = Array.from({ length: daysVisible }, (_, i) =>
    addDays(startDate, i),
  );

  const canGoBack = startDate > today;

  return (
    <section className="dates border rounded-2 p-3 p-md-4 mb-4">
      <h2 className="date-title h6 text-uppercase mb-3">Välj datum</h2>

      <nav
        aria-label="Datumväljare"
        className="date-picker d-flex align-items-stretch gap-2 border rounded-2 p-3"
      >
        <button
          type="button"
          className="date-button btn border rounded-2"
          aria-label="Föregående datum"
          disabled={!canGoBack}
          onClick={() => setStartDate((d) => addDays(d, -daysVisible))}
        >
          ←
        </button>

        <ul className="list-unstyled d-flex flex-grow-1 gap-2 mb-0 overflow-auto">
          {days.map((day) => {
            const value = day.toLocaleDateString("sv-SE");
            const isSelected = value === selectedDate;

            return (
              <li key={value} className="flex-fill">
                <button
                  type="button"
                  className={`date-button btn border rounded-2 w-100 py-2 ${isSelected ? "active" : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(value)}
                >
                  <time
                    dateTime={value}
                    className="d-block fw-semibold text-uppercase"
                  >
                    {day.toLocaleDateString("sv-SE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </time>
                  <small className="d-block text-capitalize">
                    {day.toLocaleDateString("sv-SE", { weekday: "short" })}
                  </small>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="date-button btn border rounded-2"
          aria-label="Nästa datum"
          onClick={() => setStartDate((d) => addDays(d, daysVisible))}
        >
          →
        </button>
      </nav>
    </section>
  );
}