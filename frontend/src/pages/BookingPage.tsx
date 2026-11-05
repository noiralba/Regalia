import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type {
  BookingConfirmation,
  Movies,
  MovieScreening,
} from "../types/types";
import BookingConfirmationModal from "../components/BookingConfirmationModal/BookingConfirmationModal";
import { pages } from "../routeConfig";
import "../styles/BookingPage.scss";
import SeatMap from "../components/SeatMap/SeatMap";
import SeatMapModal from "../components/SeatMap/SeatMapModal";
import { getById } from "../api/api";
import { getMovieImage } from "../utils/getMovieImage";
import { extractIdFromSlug } from "../utils/slugify";
import { useSeatPolling } from "../hooks/useSeatPolling";
import { useSeatSelection } from "../hooks/useSeatSelection";

interface TicketType {
  ticket_type_id: string;
  "Ticket Type": string;
  "Price (SEK)": string;
}

function BookingPage() {
  const { showingSlug } = useParams(); // 1. Läs ut hela sluggen
  const visningId = extractIdFromSlug(showingSlug); // 2. Extrahera ut visningen
  const navigate = useNavigate();
  const [showing, setShowing] = useState<MovieScreening | null>(null);
  const [movie, setMovie] = useState<Movies | null>(null);
  const [error, setError] = useState("");
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const { seats, refreshSeats } = useSeatPolling(visningId);
  const totalTickets = Object.values(ticketCounts).reduce(
    (total, count) => total + count,
    0,
  );
  // hämtar platsval/funktioner från vår egna hook useSeatSelection
const {
  selectedSeats,
  setSelectedSeats,
  hasManuallySelectedSeats,
  setHasManuallySelectedSeats,
  toggleSeat: selectSeat,
} = useSeatSelection(seats, totalTickets, showing?.Screen ?? "");
  function toggleSeat(seatId: string) {
    if (error.includes("blivit bokade av någon annan")) {
      setError("");
    }

    selectSeat(seatId);
  }
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  // Håller reda på om en bokning håller på att skickas
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] =
    useState<BookingConfirmation | null>(null);

  // Kontrollera om någon annan har bokat en av användarens valda platser
  useEffect(() => {
    if (selectedSeats.length === 0 || seats.length === 0) return;

    const unavailableSeats = selectedSeats.filter((selectedId) =>
      seats.some((seat) => seat.seat_id === selectedId && !seat.Available),
    );

    if (unavailableSeats.length === 0) return;

    const timeout = setTimeout(() => {
      // Tar bort de platser som inte längre kan väljas
      setSelectedSeats((previous) =>
        previous.filter((id) => !unavailableSeats.includes(id)),
      );

      setError(
        "En eller flera av dina valda sittplatser har tyvärr blivit bokade av någon annan. Vänligen välj nya platser.",
      );
    }, 0);

    return () => clearTimeout(timeout);
  }, [seats, selectedSeats, setSelectedSeats]);

  // Hämta info om vald filmvisnign från backend
  useEffect(() => {
    if (!visningId) return;
    async function fetchShowing() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/shows/${visningId}`,
        );
        if (!response.ok) {
          throw new Error("Could not fetch showing");
        }
        const data: MovieScreening = await response.json();
        setShowing(data);
        const movieData = await getById<Movies>("/api/movies", data.movie_id);
        setMovie(movieData);
      } catch (error) {
        console.error(error);
        setError("Kunde inte hämta filmvisningen.");
      }
    }
    fetchShowing();
  }, [visningId]);
  // Hämta biljettyper och priser från backend
  useEffect(() => {
    async function fetchTicketTypes() {
      try {
        const response = await fetch("http://localhost:3000/api/ticket-types");
        if (!response.ok) {
          throw new Error("Could not fetch ticket types");
        }
        const data: TicketType[] = await response.json();
        setTicketTypes(data);
      } catch (error) {
        console.error(error);
        setError("Kunde inte hämta biljettyperna.");
      }
    }
    fetchTicketTypes();
  }, []);

  // FUNKTIONER
  //Ökar/minskar antalet biljetter
function changeTicketCount(ticketTypeId: string, change: number) {
  const newCount = Math.max(0, (ticketCounts[ticketTypeId] || 0) + change);
  // Räknar ut nya totala antalet biljetter
  const newTotalTickets =
    totalTickets - (ticketCounts[ticketTypeId] || 0) + newCount;

  setTicketCounts((previous) => ({
    ...previous,
    [ticketTypeId]: newCount,
  }));
  // Om alla biljetter tas bort återgår platsvalet till automatiskt läge
  if (newTotalTickets === 0) {
    setHasManuallySelectedSeats(false);
    // körs om användaren minskar antalet manuellt valda biljtter (tar bort senast valda)
  } else if (change < 0 && hasManuallySelectedSeats) {
    setSelectedSeats((previous) => previous.slice(0, -1));
  }
}

  // handleBooking börjar här. Kontrollerar bokningsuppgifterna och skickar bokningen till backend
  async function handleBooking() {
    if (totalTickets === 0) {
      setError("Du måste välja minst en biljett.");
      return;
    }
    // Antalet valda sittplatser måste motsvara antalet biljetter
    if (selectedSeats.length !== totalTickets) {
      setError("Du måste välja lika många sittplatser som biljetter.");
      return;
    }
    // Kontrollerar att e-postadressen har ett giltigt format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Vänligen ange en giltig e-postadress.");
      return;
    }
    // Förhindrar flera bokningsanrop samtidigt
    if (isBooking) return;
    setError("");
    setIsBooking(true);
    // Skapar en lista med biljettyper, en för varje vald biljett
    const selectedTicketTypes: string[] = [];
    ticketTypes.forEach((ticket) => {
      const count = ticketCounts[ticket.ticket_type_id] || 0;
      for (let i = 0; i < count; i++) {
        selectedTicketTypes.push(ticket.ticket_type_id);
      }
    });
    // Kopplar varje vald sittplats till en biljettyp
    // Detta är info som skickas till backend
    const bookingData = {
      show_id: visningId,
      user_email: email,
      seats: selectedSeats.map((seatId, index) => ({
        seat_id: seatId,
        ticket_type_id: selectedTicketTypes[index],
      })),
    };
    // Skicka bokningen till backend
    try {
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      // Hanterar om en sittplats redan har bokats
      if (response.status === 409) {
        // Hämtar platsinfo från backend
        await refreshSeats();

        // Rensar användarens tidigare valda sittplatser
        setSelectedSeats([]);

        // Visar ett felmeddelande så användaren kan välja nya platser
        setError(
          "En av dina valda platser är tyvärr redan bokad. Vänligen Välj nya sittplatser.",
        );

        return;
      }
      if (!response.ok) {
        throw new Error("Could not create booking");
      }
      // Hämtar bokningsbekräftelsen från backend
      const data: BookingConfirmation = await response.json();
      setBookingConfirmation(data);
      console.log("Bokning skapad:", data);
    } catch (error) {
      console.error(error);
      setError("Kunde inte genomföra bokningen.");
    } finally {
      // Återställer knappen
      setIsBooking(false);
    }
  }
  // BERÄKNINGAR
  // Beräknar totalpriset biljetter och pris
  const totalPrice = ticketTypes.reduce((total, ticket) => {
    const count = ticketCounts[ticket.ticket_type_id] || 0;
    const price = Number(ticket["Price (SEK)"]);
    return total + count * price;
  }, 0);

  return (
    <main className="booking-page">
      <h1>Boka biljetter</h1>
      {bookingConfirmation && (
        <BookingConfirmationModal
          confirmation={bookingConfirmation}
          onClose={() => navigate(pages.home.path)}
        />
      )}
      <div className="booking-page__top">
        <section className="booking-page__showing">
          <h2>Vald film</h2>
          {!showing && !error && <p>Hämtar visning...</p>}
          {showing && (
            <div className="booking-page__movie">
              <div className="booking-page__poster">
                {movie && (
                  <img
                    src={getMovieImage(movie.posterImage)}
                    alt={`Filmaffisch för ${movie.title}`}
                  />
                )}
              </div>
              <div className="booking-page__movie-details">
                <h3>{showing.Movie}</h3>
                <p>Datum: {showing["Screening Date"]}</p>
                <p>Tid: {showing["Start Time"]}</p>
                <p>Salong: {showing.Screen}</p>
              </div>
            </div>
          )}
        </section>
        <section className="booking-page__tickets">
          <h2>Välj biljetter</h2>
          {ticketTypes.map((ticket) => (
            <article
              className="booking-page__ticket-row"
              key={ticket.ticket_type_id}
            >
              <h3>{ticket["Ticket Type"]}</h3>
              <p>{Number(ticket["Price (SEK)"])} kr</p>
              <button
                type="button"
                onClick={() => changeTicketCount(ticket.ticket_type_id, -1)}
                disabled={!ticketCounts[ticket.ticket_type_id]}
              >
                -
              </button>
              <span>{ticketCounts[ticket.ticket_type_id] || 0}</span>
              <button
                type="button"
                onClick={() => changeTicketCount(ticket.ticket_type_id, 1)}
              >
                +
              </button>
            </article>
          ))}
          <p>Totalt: {totalPrice} kr</p>
        </section>
      </div>
      <section className="booking-page__seats">
        <h2>Välj sittplatser</h2>

        {showing && (
          <p className="booking-page__screen-name">{showing.Screen}</p>
        )}

        <button
          type="button"
          className="booking-page__open-seats"
          onClick={() => setIsSeatModalOpen(true)}
        >
          Välj sittplatser
        </button>

        <SeatMap
          seats={seats}
          selectedSeats={selectedSeats}
          toggleSeat={toggleSeat}
          screen={showing?.Screen ?? ""}
        />
        {isSeatModalOpen && (
          <SeatMapModal
            seats={seats}
            selectedSeats={selectedSeats}
            toggleSeat={toggleSeat}
            onClose={() => setIsSeatModalOpen(false)}
            screen={showing?.Screen ?? ""}
          />
        )}
      </section>

      <section className="booking-page__summary">
        <h2>Din bokning</h2>

        <div className="booking-page__summary-content">
          <div className="booking-page__summary-details">
            {showing && (
              <>
                <div className="booking-page__summary-row">
                  <span>Film</span>
                  <span>{showing.Movie}</span>
                </div>

                <div className="booking-page__summary-row">
                  <span>Visning</span>
                  <span>
                    {showing["Screening Date"]} • {showing["Start Time"]}
                  </span>
                </div>

                <div className="booking-page__summary-row">
                  <span>Salong</span>
                  <span>{showing.Screen}</span>
                </div>

                <div className="booking-page__summary-row">
                  <span>Platser</span>
                  <span>
                    {seats
                      .filter((seat) => selectedSeats.includes(seat.seat_id))
                      .map(
                        (seat) => `${seat["Seat Row"]}${seat["Seat Number"]}`,
                      )
                      .join(", ") || "Inga platser valda"}
                  </span>
                </div>

                <div className="booking-page__summary-row">
                  <span>Biljetter</span>
                  <span>{totalTickets} st</span>
                </div>

                <div className="booking-page__summary-row">
                  <span>TOTALT</span>
                  <span>{totalPrice} kr</span>
                </div>
              </>
            )}
          </div>

          <div className="booking-page__summary-email">
            <p>
              Fyll i din e-postadress för att slutföra bokningen. Din
              bokningsbekräftelse skickas till den angivna adressen.
            </p>

            <label htmlFor="email">E-postadress</label>
            <input
              className="booking-page__email"
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="namn@exempel.se"
              required
            />
          </div>
        </div>

        {error && <p className="booking-page__summary-error">{error}</p>}

        <button
          className="booking-page__confirm-button"
          type="button"
          onClick={handleBooking}
          disabled={isBooking}
        >
          {isBooking ? "Bokar..." : "Bekräfta bokning"}
        </button>
      </section>
    </main>
  );
}
export default BookingPage;
