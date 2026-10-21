import { useState } from "react";

type Booking = {
  bookingNumber: string;
  email: string;
  movieTitle: string;
  showTime: string;
  seats: string[];
};

export default function CancellationPage() {
  const [bookingNumber, setBookingNumber] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotFound(false);

    // TODO (nästa story): hämta bokningen med bookingNumber + email
    // Platshållare så att du kan se gränssnittet:
    const found: Booking | null = {
      bookingNumber,
      email,
      movieTitle: "Exempelfilm",
      showTime: "2026-11-01 19:00",
      seats: ["A1", "A2"],
    };

    if (found) {
      setBooking(found);
    } else {
      setNotFound(true);
    }
  }

  function handleEdit() {
    // TODO (nästa story): ändra bokningen, t.ex. navigera till en ändringsvy
    console.log("Ändra bokning", booking?.bookingNumber);
  }

  function handleConfirmCancel() {
    // TODO (nästa story): radera bokningen via API
    console.log("Avboka", booking?.bookingNumber);
    setCancelled(true);
    setConfirmingCancel(false);
    setBooking(null);
  }

  function handleReset() {
    setBookingNumber("");
    setEmail("");
    setBooking(null);
    setNotFound(false);
    setConfirmingCancel(false);
    setCancelled(false);
  }

  if (cancelled) {
    return (
      <main className="container py-4">
        <h1 className="mb-3">Avbokning</h1>
        <div className="alert alert-success" role="alert">
          Din bokning är avbokad.
        </div>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          Tillbaka
        </button>
      </main>
    );
  }

  if (booking) {
    return (
      <main className="container py-4">
        <h1 className="mb-3">Din bokning</h1>

        <div className="card mb-3 col-12 col-md-6 col-lg-4">
          <div className="card-body">
            <p className="mb-1">
              <strong>Bokningsnummer:</strong> {booking.bookingNumber}
            </p>
        </div>
        </div>

        {!confirmingCancel ? (
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-primary" onClick={handleEdit}>
              Ändra bokning
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setConfirmingCancel(true)}
            >
              Avboka
            </button>
          </div>
        ) : (
          <div className="alert alert-warning col-12 col-md-6 col-lg-4" role="alert">
            <p className="mb-3">Är du säker på att du vill avboka?</p>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmCancel}
              >
                Ja, avboka
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setConfirmingCancel(false)}
              >
                Nej, behåll
              </button>
            </div>
          </div>
        )}

        <button type="button" className="btn btn-link mt-3 ps-0" onClick={handleReset}>
          Sök efter en annan bokning
        </button>
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="mb-3">Avbokning</h1>
      <p className="mb-4">
        Fyll i ditt bokningsnummer och din e-postadress för att hitta din bokning.
      </p>

      {notFound && (
        <div className="alert alert-danger col-12 col-md-6 col-lg-4" role="alert">
          Vi hittade ingen bokning med de uppgifterna.
        </div>
      )}

      <form onSubmit={handleSubmit} className="col-12 col-md-6 col-lg-4">
        <div className="mb-3">
          <label htmlFor="bookingNumber" className="form-label">
            Bokningsnummer
          </label>
          <input
            id="bookingNumber"
            type="text"
            className="form-control"
            value={bookingNumber}
            onChange={(e) => setBookingNumber(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            E-postadress
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Sök bokning
        </button>
      </form>
    </main>
  );
}