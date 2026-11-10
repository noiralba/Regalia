import type { MovieScreening } from "../../../types/types";
import { FormField } from "../../Forms";
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
  isLoggedIn: boolean;
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
  isLoggedIn,
}: BookingSummaryProps) {
  return (
    <section className="booking-summary">
      <h2>Din bokning</h2>

      <section className="booking-summary__content">
        <article className="booking-summary__details">
          {showing && (
            <>
              <figure className="booking-summary__row">
                <p>Film</p>
                <p>{showing.Movie}</p>
                <p>Visning</p>
                <p>
                  {showing["Screening Date"]} • {showing["Start Time"]}
                </p>
                <p>Salong</p>
                <p>{showing.Screen}</p>
                <p>Platser</p>
                <p>{seatLabels || "Inga platser valda"}</p>
                <p>Biljetter</p>
                <p>{totalTickets} st</p>
                <b>TOTALT</b>
                <b>{totalPrice} kr</b>
              </figure>
            </>
          )}
        </article>

        <article className="booking-summary__email">
          <p>
            Fyll i din e-postadress för att slutföra bokningen. Din
            bokningsbekräftelse skickas till den angivna adressen.
          </p>
          <FormField
            id="email"
            label="E-postadress"
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            autoComplete="email"
            readOnly={isLoggedIn}
          />
        </article>
      </section>

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
