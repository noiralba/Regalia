import type { Seat } from "../../../types/types";
import SeatMap from "./SeatMap";
import "./SeatMapModal.scss";


interface SeatMapModalProps {
  seats: Seat[];
  selectedSeats: string[];
  toggleSeat: (seatId: string) => void;
  onClose: () => void;
  screen: string;
  ticketCount: number;
  selectSeatGroup: (seatIds: string[]) => void;
}

function SeatMapModal({
  seats,
  selectedSeats,
  toggleSeat,
  onClose,
  screen,
  ticketCount,
  selectSeatGroup,
}: SeatMapModalProps) {
  return (
    <section className="seat-map-modal__overlay">
      <article
        className="seat-map-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Välj sittplatser"
      >
        <button
          type="button"
          className="seat-map-modal__close-icon"
          onClick={onClose}
          aria-label="Stäng sittplatskartan"
        >
          ×
        </button>

        <SeatMap
          seats={seats}
          selectedSeats={selectedSeats}
          toggleSeat={toggleSeat}
          screen={screen}
          ticketCount={ticketCount}
          selectSeatGroup={selectSeatGroup}
        />

        <button
          className="seat-map-modal__close"
          type="button"
          onClick={onClose}
        >
          Klar
        </button>
      </article>
    </section>
  );
}

export default SeatMapModal;
