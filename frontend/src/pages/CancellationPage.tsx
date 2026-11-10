import { useState } from "react";
import { useNavigate } from "react-router";
import { useCancellation } from "../hooks/useCancellation";

const colors = {
  background: "#100d0e",
  card: "#1a1416",
  red: "#6e1726",
  gold: "#a8864a",
  cream: "#ecdbb0",
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  padding: "2rem 1rem",
  color: colors.cream,
  backgroundColor: colors.background,
  fontFamily: '"Manrope", sans-serif',
};

const headingStyle: React.CSSProperties = {
  color: colors.gold,
  fontFamily: '"Monomakh", serif',
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: colors.card,
  border: "1px solid rgba(168, 134, 74, 0.35)",
  borderRadius: "8px",
};

const buttonStyle: React.CSSProperties = {
  color: colors.cream,
  backgroundColor: colors.red,
  border: `1px solid ${colors.gold}`,
  borderRadius: "8px",
  fontFamily: '"Manrope", sans-serif',
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  color: colors.background,
  backgroundColor: colors.cream,
  border: `1px solid ${colors.gold}`,
};

export default function CancellationPage() {
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

  if (loading) return <p style={pageStyle}>Laddar...</p>;
  if (error) return <p style={pageStyle}>{error}</p>;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    searchBooking(bookingNumber, email);
  }

  async function handleConfirmCancel() {
    await cancelBooking();
    setConfirmingCancel(false);
  }

  if (cancelled) {
    return (
      <main className="container py-5" style={pageStyle}>
        <section
          className="p-4 mx-auto"
          style={{ ...cardStyle, maxWidth: "650px" }}
        >
          <h1 className="mb-3 text-center" style={headingStyle}>
            Avbokning
          </h1>

          <p
            className="alert text-center"
            role="alert"
            style={{
              color: colors.cream,
              backgroundColor: colors.card,
              border: `1px solid ${colors.gold}`,
            }}
          >
            Din bokning är avbokad.
          </p>

          <button
            type="button"
            className="btn"
            style={buttonStyle}
            onClick={() => navigate("/")}
          >
            Tillbaka
          </button>
        </section>
      </main>
    );
  }

  if (booking) {
    return (
      <main className="container py-5" style={pageStyle}>
        <section
          className="p-4 mx-auto"
          style={{ ...cardStyle, maxWidth: "650px" }}
        >
          <h1 className="mb-3" style={headingStyle}>
            Din bokning
          </h1>

          <section className="card mb-3" style={cardStyle}>
            <article className="card-body">
              <p className="mb-1">
                <strong style={{ color: colors.gold }}>Bokningsnummer:</strong>{" "}
                {booking.bookingNumber}
              </p>
            </article>
          </section>

          {!confirmingCancel ? (
            <section className="d-flex flex-wrap gap-2">
              {cancelError && (
                <p
                  className="alert col-12"
                  role="alert"
                  style={{
                    color: colors.cream,
                    backgroundColor: colors.card,
                    border: "1px solid #dc3545",
                  }}
                >
                  {cancelError}
                </p>
              )}

              <button
                type="button"
                className="btn"
                style={buttonStyle}
                onClick={() => navigate(-1)}
              >
                Avbryt
              </button>

              <button
                type="button"
                className="btn"
                style={buttonStyle}
                onClick={() => setConfirmingCancel(true)}
              >
                Avboka
              </button>
            </section>
          ) : (
            <section
              className="alert"
              role="alert"
              style={{
                color: colors.cream,
                backgroundColor: colors.background,
                border: `1px solid ${colors.gold}`,
              }}
            >
              <p className="mb-3">Är du säker på att du vill avboka?</p>

              <article className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn"
                  style={buttonStyle}
                  onClick={handleConfirmCancel}
                >
                  Ja, avboka
                </button>

                <button
                  type="button"
                  className="btn"
                  style={buttonStyle}
                  onClick={() => setConfirmingCancel(false)}
                >
                  Nej, behåll
                </button>
              </article>
            </section>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="container py-5" style={pageStyle}>
      <section
        className="p-4 mx-auto"
        style={{ ...cardStyle, maxWidth: "650px" }}
      >
        <h1 className="mb-3 text-center" style={headingStyle}>
          Avboka bokning
        </h1>

        <p className="mb-4 text-center">
          Fyll i ditt bokningsnummer och din e-postadress för att hitta din
          bokning.
        </p>

        {notFound && (
          <p
            className="alert"
            role="alert"
            style={{
              color: colors.cream,
              backgroundColor: colors.card,
              border: "1px solid #dc3545",
            }}
          >
            Vi hittade ingen bokning med de uppgifterna.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <section className="mb-3">
            <label
              htmlFor="bookingNumber"
              className="form-label"
              style={{ color: colors.gold }}
            >
              Bokningsnummer
            </label>

            <input
              id="bookingNumber"
              type="text"
              className="form-control"
              style={inputStyle}
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              required
            />
          </section>

          <section className="mb-3">
            <label
              htmlFor="email"
              className="form-label"
              style={{ color: colors.gold }}
            >
              E-postadress
            </label>

            <input
              id="email"
              type="email"
              className="form-control"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </section>

          <button type="submit" className="btn me-2" style={buttonStyle}>
            Sök bokning
          </button>

          <button
            type="button"
            className="btn"
            style={buttonStyle}
            onClick={() => navigate(-1)}
          >
            Avbryt
          </button>
        </form>
      </section>
    </main>
  );
}
