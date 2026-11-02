// Component to display a booking bar for a movie showing. It shows the number of available seats and provides a button to book tickets. The button is disabled if there are no showings available.

import "./BookingBar.scss";

type Props = {
  hasShowing: boolean;
  seatsLoading: boolean;
  totalSeats: number;
  Screen: string;
  availableSeats: number;
  onBook: () => void;
};

export default function BookingBar({
  hasShowing,
  seatsLoading,
  totalSeats,
  Screen,
  availableSeats,
  onBook,
}: Props) {
  return (
    <section className="booking" aria-live="polite">
      {hasShowing && (
        <p className="booking-info">
          {Screen && <span>{Screen}</span>}
          <p className="booking-info__separator">|</p>
          {availableSeats > 0 ? (
            <span>{availableSeats} av {totalSeats}</span>
          ) : (
        <p>
          {seatsLoading
            ? "Hämtar platsinformation..."
            : totalSeats > 0
              ? `${availableSeats} av ${totalSeats}`
              : "Platsinformation saknas"}
              </p>
          )}
        </p>

      )}
      <button
        className="book-button"
        type="button"
        disabled={!hasShowing}
        onClick={onBook}
      >
        BOKA NU
      </button>
    </section>
  );
}
