import React from "react";
import { useState } from "react";
import type { UserBookingHistory } from "../../types/types";
import FormAlert from "../Forms/FormAlert/FormAlert";
import { Button } from "react-bootstrap";

interface MyPageItemProps {
  booking: UserBookingHistory;
  onCancel?: (bookingNumber: string) => Promise<boolean>;
}

export const MyPageItem: React.FC<MyPageItemProps> = ({ booking, onCancel }) => {
    const [confirming, setConfirming] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState("");

    const canCancel = Boolean(onCancel) && booking.status !== "CANCELLED";

    async function handleConfirm() {
      if (!onCancel) return;
      setIsCancelling(true);
      setCancelError("");

      const ok = await onCancel(booking.booking_number);

      setIsCancelling(false);
      if (ok) {
        setConfirming(false);
      } else {
        setCancelError("Bokningen kunde inte avbokas. Försök igen.");
      }
    }

  return (
    <li className="user-bookings">
      <article className="user-bookings__info">
        <h3>{booking.movie_title}</h3>
        {booking.status === "CANCELLED" && (
          <p>
            <strong>Status:</strong> Avbokad
          </p>
        )}
        <p>
          <strong>Bokningsnummer:</strong> {booking.booking_number}
        </p>
        <p>
          <strong>Datum:</strong>{" "}
          <time dateTime={`${booking.show_date}T${booking.show_time}`}>
            {booking.show_date} kl. {booking.show_time.substring(0, 5)}
          </time>
        </p>
        <p>
          <strong>Salong:</strong> {booking.screen_name}
        </p>
        <p>
          <strong>Platser ({booking.seat_count} st):</strong> {booking.seats}
        </p>
        <p>
          <strong>Totalpris:</strong> {booking.total_price_sek} kr
        </p>

        <FormAlert message={cancelError} />

        {canCancel &&
          (confirming ? (
            <article className="user-bookings__confirm">
              <FormAlert
              variant="warning"
                message="Är du säker på att du vill avboka?"
              />
              <figure className="user-bookings__actions">
                <Button
                  variant="primary"
                  className="user-bookings__primary"
                  onClick={handleConfirm}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Avbokar..." : "Ja, avboka"}
                </Button>
                <Button
                  variant="secondary"
                  className="user-bookings__secondary"
                  onClick={() => setConfirming(false)}
                  disabled={isCancelling}
                >
                  Nej, behåll
                </Button>
              </figure>
            </article>
          ) : (
            <Button
              variant="primary"
              className="user-bookings__cancel"
              onClick={() => setConfirming(true)}
            >
              Avboka
            </Button>
          ))}
      </article>
    </li>
  );
};
