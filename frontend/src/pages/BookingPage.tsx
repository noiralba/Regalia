import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router";
import type {
  BookingConfirmation,
  Movies,
  MovieScreening,
  TicketType,
} from "../types/types";
import BookingConfirmationModal from "../components/Booking/BookingConfirmationModal/BookingConfirmationModal";
import ShowingInfo from "../components/Booking/ShowingInfo/ShowingInfo";
import TicketSelector from "../components/Booking/TicketSelector/TicketSelector";
import BookingSummary from "../components/Booking/BookingSummary/BookingSummary";
import SeatMap from "../components/Booking/SeatMap/SeatMap";
import SeatMapModal from "../components/Booking/SeatMap/SeatMapModal";
import { pages } from "../routeConfig";
import { getById } from "../api/api";
import { extractIdFromSlug } from "../utils/slugify";
import { useSeatPolling } from "../hooks/useSeatPolling";
import { useSeatSelection } from "../hooks/useSeatSelection";
// import "./BookingPage.scss";

interface LayoutContext {
  userId?: string;
  userEmail?: string;
}

function BookingPage() {
  const { showingSlug } = useParams();
  const visningId = extractIdFromSlug(showingSlug);
  const navigate = useNavigate();

  const { userId, userEmail } = useOutletContext<LayoutContext>();

  const [showing, setShowing] = useState<MovieScreening | null>(null);
  const [movie, setMovie] = useState<Movies | null>(null);
  const [error, setError] = useState("");
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});

  const [email, setEmail] = useState(userEmail || "");
  const [prevUserEmail, setPrevUserEmail] = useState(userEmail);

  if (userEmail !== prevUserEmail) {
    setPrevUserEmail(userEmail);
    setEmail(userEmail || "");
  }

  const { seats, refreshSeats } = useSeatPolling(visningId);
  const totalTickets = Object.values(ticketCounts).reduce(
    (total, count) => total + count,
    0,
  );
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

  function selectSeatGroup(seatIds: string[]) {
    setSelectedSeats(seatIds);
  }

  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  // const [email, setEmail] = useState("");
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
      setSelectedSeats((previous) =>
        previous.filter((id) => !unavailableSeats.includes(id)),
      );
      setError(
        "En eller flera av dina valda sittplatser har tyvärr blivit bokade av någon annan. Vänligen välj nya platser.",
      );
    }, 0);

    return () => clearTimeout(timeout);
  }, [seats, selectedSeats, setSelectedSeats]);

  // Hämta info om vald filmvisning från backend
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

  // Ökar/minskar antalet biljetter
  function changeTicketCount(ticketTypeId: string, change: number) {
    const newCount = Math.max(0, (ticketCounts[ticketTypeId] || 0) + change);
    const newTotalTickets =
      totalTickets - (ticketCounts[ticketTypeId] || 0) + newCount;

    setTicketCounts((previous) => ({
      ...previous,
      [ticketTypeId]: newCount,
    }));

    // Om alla biljetter tas bort återgår platsvalet till automatiskt läge
    if (newTotalTickets === 0) {
      setHasManuallySelectedSeats(false);
    } else if (change < 0 && hasManuallySelectedSeats) {
      // Minskar användaren manuellt valda biljetter tas senast valda plats bort
      setSelectedSeats((previous) => previous.slice(0, -1));
    }
  }

  async function handleBooking() {
    if (totalTickets === 0) {
      setError("Du måste välja minst en biljett.");
      return;
    }
    if (selectedSeats.length !== totalTickets) {
      setError("Du måste välja lika många sittplatser som biljetter.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Vänligen ange en giltig e-postadress.");
      return;
    }
    if (isBooking) return;
    setError("");
    setIsBooking(true);

    const selectedTicketTypes: string[] = [];
    ticketTypes.forEach((ticket) => {
      const count = ticketCounts[ticket.ticket_type_id] || 0;
      for (let i = 0; i < count; i++) {
        selectedTicketTypes.push(ticket.ticket_type_id);
      }
    });

    const bookingData = {
      show_id: visningId,
      user_email: email,
      user_id: userId || null,
      seats: selectedSeats.map((seatId, index) => ({
        seat_id: seatId,
        ticket_type_id: selectedTicketTypes[index],
      })),
    };

    try {
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.status === 409) {
        await refreshSeats();
        setSelectedSeats([]);
        setError(
          "En av dina valda platser är tyvärr redan bokad. Vänligen välj nya sittplatser.",
        );
        return;
      }
      if (!response.ok) {
        throw new Error("Could not create booking");
      }
      const data: BookingConfirmation = await response.json();
      setBookingConfirmation(data);
    } catch (error) {
      console.error(error);
      setError("Kunde inte genomföra bokningen.");
    } finally {
      setIsBooking(false);
    }
  }

  // BERÄKNINGAR
  const totalPrice = ticketTypes.reduce((total, ticket) => {
    const count = ticketCounts[ticket.ticket_type_id] || 0;
    return total + count * Number(ticket["Price (SEK)"]);
  }, 0);

  const seatLabels = seats
    .filter((seat) => selectedSeats.includes(seat.seat_id))
    .map((seat) => `${seat["Seat Row"]}${seat["Seat Number"]}`)
    .join(", ");

  return (
    <main className="page-container">
      <h1 className="text-uppercase mb-4">Boka biljetter</h1>

      {bookingConfirmation && (
        <BookingConfirmationModal
          confirmation={bookingConfirmation}
          onClose={() => navigate(pages.home.path)}
        />
      )}

      <article className="booking-page__top">
        <ShowingInfo showing={showing} movie={movie} hasError={!!error} />
        <TicketSelector
          ticketTypes={ticketTypes}
          ticketCounts={ticketCounts}
          totalPrice={totalPrice}
          onChangeCount={changeTicketCount}
        />
      </article>

      <section className="booking-page__seats">
        <h2 className="mt-4">Välj sittplatser</h2>

        {showing && <p className="text-uppercase">{showing.Screen}</p>}

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
          ticketCount={totalTickets}
          selectSeatGroup={selectSeatGroup}
        />
        {isSeatModalOpen && (
          <SeatMapModal
            seats={seats}
            selectedSeats={selectedSeats}
            toggleSeat={toggleSeat}
            onClose={() => setIsSeatModalOpen(false)}
            screen={showing?.Screen ?? ""}
            ticketCount={totalTickets}
            selectSeatGroup={selectSeatGroup}
          />
        )}
      </section>

      <BookingSummary
        showing={showing}
        seatLabels={seatLabels}
        totalTickets={totalTickets}
        totalPrice={totalPrice}
        email={email}
        onEmailChange={setEmail}
        error={error}
        isBooking={isBooking}
        onConfirm={handleBooking}
        isLoggedIn={Boolean(userEmail)}
      />
    </main>
  );
}

export default BookingPage;
