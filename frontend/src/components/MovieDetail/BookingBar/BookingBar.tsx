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
        <div className="booking-info">
          {Screen && <span>{Screen}</span>}
          <span className="booking-info__separator">|</span>
          {availableSeats > 0 ? (
            <span>
              {availableSeats} av {totalSeats}
            </span>
          ) : (
            <span>
              {seatsLoading
                ? "Hämtar platsinformation..."
                : totalSeats > 0
                  ? `${availableSeats} av ${totalSeats}`
                  : "Platsinformation saknas"}
            </span>
          )}
        </div>
      )}
      <button
        className="book-button"
        type="button"
        disabled={!hasShowing}
        onClick={onBook}
      >
        Fortsätt
      </button>
    </section>
  );
}
