import type { MovieScreening } from "../../../types/types";
import "./BookingSummary.scss";

interface BookingSummaryProps {
  showing: MovieScreening | null;
  seatLabels: string;
  totalTickets: number;
  totalPrice: number;
  email: string;
  onEmailChange: (email: string) => void;
  error: string;
  isBooking: boolean;
  onConfirm: () => void;
}

function BookingSummary({
  showing,
  seatLabels,
  totalTickets,
  totalPrice,
  email,
  onEmailChange,
  error,
  isBooking,
  onConfirm,
}: BookingSummaryProps) {
  return (
    <section className="booking-summary">
      <h2>Din bokning</h2>

      <div className="booking-summary__content">
        <div className="booking-summary__details">
          {showing && (
            <>
              <div className="booking-summary__row">
                <span>Film</span>
                <span>{showing.Movie}</span>
              </div>
              <div className="booking-summary__row">
                <span>Visning</span>
                <span>
                  {showing["Screening Date"]} • {showing["Start Time"]}
                </span>
              </div>
              <div className="booking-summary__row">
                <span>Salong</span>
                <span>{showing.Screen}</span>
              </div>
              <div className="booking-summary__row">
                <span>Platser</span>
                <span>{seatLabels || "Inga platser valda"}</span>
              </div>
              <div className="booking-summary__row">
                <span>Biljetter</span>
                <span>{totalTickets} st</span>
              </div>
              <div className="booking-summary__row">
                <span>TOTALT</span>
                <span>{totalPrice} kr</span>
              </div>
            </>
          )}
        </div>

        <div className="booking-summary__email">
          <p>
            Fyll i din e-postadress för att slutföra bokningen. Din
            bokningsbekräftelse skickas till den angivna adressen.
          </p>
          <label htmlFor="email">E-postadress</label>
          <input
            className="booking-summary__input"
            type="email"
            id="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="namn@exempel.se"
            required
          />
        </div>
      </div>

      {error && <p className="booking-summary__error">{error}</p>}

      <button
        className="booking-summary__confirm"
        type="button"
        onClick={onConfirm}
        disabled={isBooking}
      >
        {isBooking ? "Bokar..." : "Bekräfta bokning"}
      </button>
    </section>
  );
}

export default BookingSummary;
