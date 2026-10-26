import type { BookingConfirmation } from "../types/types";
import "../styles/BookingConfirmationModal.scss";

interface BookingConfirmationModalProps {
  confirmation: BookingConfirmation;
  onClose: () => void;
}

function BookingConfirmationModal({
  confirmation,
  onClose,
}: BookingConfirmationModalProps) {

return (
  <div className="booking-modal__overlay">
    <div
      className="booking-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <h2 id="confirmation-title">BOKNING KLAR!</h2>

      <p>
        Din bokningsbekräftelse och ditt bokningsnummer har skickats till:
        <span className="booking-modal__email">{confirmation.Email}</span>
      </p>

      <p>
        Bokningsnummer
        <span className="booking-modal__number">
          {confirmation["Booking Number"]}
        </span>
      </p>

      <button type="button" onClick={onClose}>
        TILLBAKA TILL STARTSIDAN
      </button>
    </div>
  </div>
);

}

export default BookingConfirmationModal;