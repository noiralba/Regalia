import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { BookingSearch } from "../types/types";
import { get, del } from "../api/api";

export default function CancellationPage() {
  const [bookingNumber, setBookingNumber] = useState("");
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<BookingSearch[]>([]);
  const [booking, setBooking] = useState<BookingSearch | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await get<Record<string, string>[]>("/api/bookings");

        setBookings(
          data.map((b) => ({
            bookingNumber: b["Booking Number"],
            email: b["Email"],
          })),
        );
      } catch (err) {
        console.error("Kunde inte hämta bokningar:", err);
        setError("Bokningarna kunde inte laddas.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (loading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotFound(false);

    const found = bookings.find(
      (b) =>
        b.bookingNumber === bookingNumber.trim() &&
        b.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (found) {
      setBooking(found);
    } else {
      setNotFound(true);
    }
  }

  async function handleConfirmCancel() {
    if (!booking) return;

    try {
      await del(`/api/bookings/${encodeURIComponent(booking.bookingNumber)}`);

      setBookings((prev) =>
        prev.filter((b) => b.bookingNumber !== booking.bookingNumber),
      );
      setCancelled(true);
      setConfirmingCancel(false);
      setBooking(null);
    } catch (err) {
      console.error("Kunde inte avboka:", err);
      setCancelError("Bokningen kunde inte avbokas. Försök igen.");
      setConfirmingCancel(false);
    }
  }

  // function handleReset() {
  //   setBookingNumber("");
  //   setEmail("");
  //   setBooking(null);
  //   setNotFound(false);
  //   setConfirmingCancel(false);
  //   setCancelled(false);
  // }

  if (cancelled) {
    return (
      <main className="container py-4">
        <h1 className="mb-3">Avbokning</h1>
        <p className="alert alert-success" role="alert">
          Din bokning är avbokad.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Tillbaka
        </button>
      </main>
    );
  }

  if (booking) {
    return (
      <main className="container py-4">
        <h1 className="mb-3">Din bokning</h1>

        <section className="card mb-3 col-12 col-md-6 col-lg-4">
          <article className="card-body">
            <p className="mb-1">
              <strong>Bokningsnummer:</strong> {booking.bookingNumber}
            </p>
          </article>
        </section>

        {!confirmingCancel ? (
          <section className="d-flex gap-2">
            {cancelError && (
              <p
                className="alert alert-danger col-12 col-md-6 col-lg-4"
                role="alert"
              >
                {cancelError}
              </p>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Avbryt
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setConfirmingCancel(true)}
            >
              Avboka
            </button>
          </section>
        ) : (
          <section
            className="alert alert-warning col-12 col-md-6 col-lg-4"
            role="alert"
          >
            <p className="mb-3">Är du säker på att du vill avboka?</p>
            <article className="d-flex gap-2">
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
            </article>
          </section>
        )}
        {/* 
        <button
          type="button"
          className="btn btn-link mt-3 ps-0"
          onClick={handleReset}
        >
          Sök efter en annan bokning
        </button> */}
      </main>
    );
  }

  return (
    <main className="container py-4">
      <h1 className="mb-3">Avboka bokning</h1>
      <p className="mb-4">
        Fyll i ditt bokningsnummer och din e-postadress för att hitta din
        bokning.
      </p>

      {notFound && (
        <p className="alert alert-danger col-12 col-md-6 col-lg-4" role="alert">
          Vi hittade ingen bokning med de uppgifterna.
        </p>
      )}

      <form onSubmit={handleSubmit} className="col-12 col-md-6 col-lg-4">
        <section className="mb-3">
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
        </section>

        <section className="mb-3">
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
        </section>

        <button type="submit" className="btn btn-primary">
          Sök bokning
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Avbryt
        </button>
      </form>
    </main>
  );
}
