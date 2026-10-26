import type { BookingConfirmation } from "../types/types";

interface BookingConfirmationModalProps {
  confirmation: BookingConfirmation;
  onClose: () => void;
}

function BookingConfirmationModal({
  confirmation,
  onClose,
}: BookingConfirmationModalProps) {
return (
  <div role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
    <h2 id="confirmation-title">BOKNING KLAR!</h2>

    <p>
      Din bokningsbekräftelse och ditt bokningsnummer har skickats till:
      <br />
      {confirmation.Email}
    </p>

    <p>
      Bokningsnummer
      <br />
      {confirmation["Booking Number"]}
    </p>

    <button type="button" onClick={onClose}>
      TILLBAKA TILL STARTSIDAN
    </button>
  </div>
);
}

export default BookingConfirmationModal;