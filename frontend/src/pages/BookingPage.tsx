import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type {
  BookingConfirmation,
  Seat,
  Movies,
  MovieScreening,
} from "../types/types";
import BookingConfirmationModal from "../components/BookingConfirmationModal/BookingConfirmationModal";
import { pages } from "../routeConfig";
import "../styles/BookingPage.scss";
import SeatMap from "../components/SeatMap/SeatMap";
import SeatMapModal from "../components/SeatMap/SeatMapModal";
import { getById } from "../api/api";
import { getMovieImage } from "../utils/movieImages";

interface TicketType {
  ticket_type_id: string;
  "Ticket Type": string;
  "Price (SEK)": string;
}

async function fetchSeats(visningId: string): Promise<Seat[]> {
  const response = await fetch(
    `http://localhost:3000/api/seats/available-seats/${visningId}`,
  );
  if (!response.ok) {
    throw new Error("Could not fetch seats");
  }
  const data: Seat[] = await response.json();
  return data;
}
function BookingPage() {
  const { visningId } = useParams();
  const navigate = useNavigate();
  const [showing, setShowing] = useState<MovieScreening | null>(null);
  const [movie, setMovie] = useState<Movies | null>(null);
  const [error, setError] = useState("");
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  // Håller reda på om en bokning håller på att skickas
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] =
    useState<BookingConfirmation | null>(null);
  
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
  // Hämta stolarna för den valda visningen
  useEffect(() => {
    if (!visningId) return;
    async function loadSeats() {
      try {
        const data = await fetchSeats(visningId!);
        setSeats(data);
      } catch (error) {
        console.error(error);
        setError("Kunde inte hämta stolarna.");
      }
    }
    loadSeats();
  }, [visningId]);
  // FUNKTIONER
  //Ökar/minskar antalet biljetter
  function changeTicketCount(ticketTypeId: string, change: number) {
    setTicketCounts((previous) => ({
      ...previous,
      [ticketTypeId]: Math.max(0, (previous[ticketTypeId] || 0) + change),
    }));
    // Tar bort den senast valda sittplatsen om antalet biljetter minskar
    if (change < 0) {
      setSelectedSeats((previous) => previous.slice(0, -1));
    }
  }
  // Markerar eller avmarkerar en sittplats
  function toggleSeat(seatId: string) {
    setSelectedSeats((previous) => {
      // Om platsen redan är vald tas den bort
      if (previous.includes(seatId)) {
        return previous.filter((id) => id !== seatId);
      }
      // Förhindrar att fler sittplatser väljs än antalet biljetter
      if (previous.length >= totalTickets) {
        return previous;
      }
      return [...previous, seatId];
    });
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
        if (visningId) {
          const updatedSeats = await fetchSeats(visningId);
          setSeats(updatedSeats);
        }
        setSelectedSeats([]);
        setError(
          "En av dina valda platser är redan bokad. Välj nya sittplatser.",
        );
        return;
      }
      if (!response.ok) {
        throw new Error("Could not create booking");
      }
      // Hämtar bokningsbekräftelsen från backend
      // Ska senare användas för att visa bekräftelsemodalen
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
  const totalTickets = Object.values(ticketCounts).reduce(
    (total, count) => total + count,
    0,
  );
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
          {error && <p>{error}</p>}
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
        />
        {isSeatModalOpen && (
          <SeatMapModal
            seats={seats}
            selectedSeats={selectedSeats}
            toggleSeat={toggleSeat}
            onClose={() => setIsSeatModalOpen(false)}
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
