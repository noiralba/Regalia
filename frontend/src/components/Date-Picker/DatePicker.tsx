import { useEffect, useState } from "react";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import "./DatePicker.scss";

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

function useResponsiveDays(max: number) {
  const calc = () => {
    if (typeof window === "undefined") return max;
    if (window.innerWidth < 480) return Math.min(2, max);
    if (window.innerWidth < 768) return Math.min(5, max);
    return max;
  };

  const [count, setCount] = useState(calc);

  useEffect(() => {
    const onResize = () => setCount(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max]);

  return count;
}

export default function DatePicker({
  selectedDate,
  onSelect,
  daysVisible = 7,
}: DatePickerProps) {
  const [today] = useState(() => new Date());
  const [startDate, setStartDate] = useState(today);
  const visible = useResponsiveDays(daysVisible);

  const days = Array.from({ length: visible }, (_, i) => addDays(startDate, i));

  const canGoBack = startDate > today;

  return (
    <section className="dates">
      <h2 className="date-title text-uppercase mb-3">Välj datum</h2>

      <nav
        aria-label="Datumväljare"
        className="date-picker d-flex gap-2 "
      >
        <button
          type="button"
          className="date-button date-arrow"
          aria-label="Föregående datum"
          disabled={!canGoBack}
          onClick={() => setStartDate((d) => addDays(d, -visible))}
        >
          <MdOutlineArrowBackIos size={20} />
        </button>

        <ul className="date-list list-unstyled d-flex flex-grow-1 gap-2 mb-0">
          {days.map((day) => {
            const value = day.toLocaleDateString("sv-SE");
            const isSelected = value === selectedDate;

            return (
              <li key={value} className="date-item">
                <button
                  type="button"
                  className={`date-button btn border rounded-2 w-100 h-100 ${isSelected ? "active" : ""}`}
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
          className="date-button date-arrow"
          aria-label="Nästa datum"
          onClick={() => setStartDate((d) => addDays(d, visible))}
        >
          <MdOutlineArrowForwardIos size={20} />
        </button>
      </nav>
    </section>
  );
}
