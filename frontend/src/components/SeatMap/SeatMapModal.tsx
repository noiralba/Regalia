import type { Seat } from "../../types/types";
import SeatMap from "./SeatMap";
import "./SeatMapModal.scss";


interface SeatMapModalProps {
  seats: Seat[];
  selectedSeats: string[];
  toggleSeat: (seatId: string) => void;
  onClose: () => void;
}

function SeatMapModal({
  seats,
  selectedSeats,
  toggleSeat,
  onClose,
}: SeatMapModalProps) {
  return (
    <div className="seat-map-modal__overlay">
      <div
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
        
        <h2>Välj sittplatser</h2>

        <SeatMap
          seats={seats}
          selectedSeats={selectedSeats}
          toggleSeat={toggleSeat}
        />

        <button
          className="seat-map-modal__close"
          type="button"
          onClick={onClose}
        >
          Klar
        </button>
      </div>
    </div>
  );
}

export default SeatMapModal;
