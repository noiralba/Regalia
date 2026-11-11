import FormAlert from "../FormAlert/FormAlert";
import FormField from "../FormField/FormField";
import FormActions from "../FormActions/FormActions";
import type { FormEvent } from "react";
import { Button } from "react-bootstrap";
import { useState, } from "react";
import { useNavigate } from "react-router";
import { useCancellation } from "../../../hooks/useCancellation";

import "./CancelForm.scss"

export default function CancelForm() {

    const [bookingNumber, setBookingNumber] = useState("");
    const [email, setEmail] = useState("");
    const [confirmingCancel, setConfirmingCancel] = useState(false);

    const navigate = useNavigate();

    const {
      booking,
      loading,
      error,
      notFound,
      cancelError,
      cancelled,
      searchBooking,
      cancelBooking,
    } = useCancellation();

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      searchBooking(bookingNumber, email);
    }

    async function handleConfirmCancel() {
      await cancelBooking();
      setConfirmingCancel(false);
    }

    if (cancelled) {
      return (
        <main className="cancellation-page">
          <section className="cancellation-card">
            <h1 className="cancellation-title">Avbokning</h1>
            <FormAlert variant="success" message="Din bokning är avbokad." />
            <Button variant="primary" onClick={() => navigate("/")}>
              Tillbaka
            </Button>
          </section>
        </main>
      );
    }

    if (booking) {
      return (
        <section className="cancellation-card">
          <h1 className="cancellation-title">Din bokning</h1>

          <p className="cancellation-booking-number">
            <strong>Bokningsnummer:</strong> {booking.bookingNumber}
          </p>

          {confirmingCancel ? (
            <>
              <FormAlert
                variant="warning"
                message="Är du säker på att du vill avboka?"
              />
              <div className="cancellation-actions">
                <Button
                  variant="primary"
                  className="cancel-button-primary"
                  onClick={handleConfirmCancel}
                >
                  Ja, avboka
                </Button>
                <Button
                  variant="secondary"
                  className="cancel-button-secondary"
                  onClick={() => setConfirmingCancel(false)}
                >
                  Nej, behåll
                </Button>
              </div>
            </>
          ) : (
            <>
              <FormAlert message={cancelError ?? ""} />
              <article className="cancellation-actions">
                <Button
                  variant="secondary"
                  className="cancel-button-secondary"
                  onClick={() => navigate(-1)}
                >
                  Avbryt
                </Button>
                <Button
                  variant="primary"
                  className="cancel-button-primary"
                  onClick={() => setConfirmingCancel(true)}
                >
                  Avboka
                </Button>
              </article>
            </>
          )}
        </section>
      );
    }

  return (

    <section className="cancellation-card">
      <h1 className="text-uppercase">Avboka bokning</h1>

      <p className="cancellation-intro">
        Fyll i ditt bokningsnummer och din e-postadress för att hitta din
        bokning.
      </p>

      <FormAlert
        message={
          error ??
          (notFound ? "Vi hittade ingen bokning med de uppgifterna." : "")
        }
      />

      <form onSubmit={handleSubmit}>
        <FormField
          id="bookingNumber"
          label="Bokningsnummer"
          value={bookingNumber}
          onChange={(e) => setBookingNumber(e.target.value)}
        />

        <FormField
          id="email"
          type="email"
          label="E-postadress"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormActions
          loading={loading}
          submitLabel="Sök bokning"
          loadingLabel="Söker..."
          onCancel={() => navigate(-1)}
        />
      </form>
    </section>
  );
}