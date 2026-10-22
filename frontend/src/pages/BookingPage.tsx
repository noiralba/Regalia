import { useEffect, useState } from "react";
import { useParams } from "react-router";

interface MovieScreening {
  show_id: string;
  Movie: string;
  "Screening Date": string;
  "Start Time": string;
  Screen: string;
  "Available Seats": number;
}

interface TicketType {
  ticket_type_id: string;
  "Ticket Type": string;
  "Price (SEK)": string;
}

interface Seat {
  show_id: string;
  seat_id: string;
  "Seat Row": string;
  "Seat Number": number;
  Status: string;
  Available: number;
}

function BookingPage() {
  const { visningId } = useParams();

  const [showing, setShowing] = useState<MovieScreening | null>(null);
  const [error, setError] = useState("");
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  // Håller reda på om en bokning håller på att skickas
  const [isBooking, setIsBooking] = useState(false);
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

    async function fetchSeats() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/seats/available-seats/${visningId}`,
        );

        if (!response.ok) {
          throw new Error("Could not fetch seats");
        }

        const data: Seat[] = await response.json();
        setSeats(data);
      } catch (error) {
        console.error(error);
        setError("Kunde inte hämta stolarna.");
      }
    }

    fetchSeats();
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
  // Kontrollerar bokningsuppgifterna och skickar bokningen till backend
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
    // Skicka bokningen till backend med POST
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
        setError(
          "En av dina valda platser är redan bokad. Välj en annan plats.",
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Could not create booking");
      }
      // Hämtar bokningsbekräftelsen från backend
      // Ska senare användas för att visa bekräftelsemodalen
      const data = await response.json();
      console.log("Bokning skapad:", data);
    } catch (error) {
      console.error(error);
      setError("Kunde inte genomföra bokningen.");
    } finally {
      // Återställer knappen när bokningsförsöket är klart
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
    <main>
      <h1>Boka biljetter</h1>

      <section>
        <h2>Vald visning</h2>

        {error && <p>{error}</p>}

        {!showing && !error && <p>Hämtar visning...</p>}

        {showing && (
          <>
            <p>Film: {showing.Movie}</p>
            <p>Datum: {showing["Screening Date"]}</p>
            <p>Tid: {showing["Start Time"]}</p>
            <p>Salong: {showing.Screen}</p>
          </>
        )}
      </section>

      <section>
        <h2>Välj biljetter</h2>

        {ticketTypes.map((ticket) => (
          <article key={ticket.ticket_type_id}>
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

      <section>
        <h2>Välj sittplatser</h2>

        {seats.map((seat) => (
          <button
            key={seat.seat_id}
            type="button"
            disabled={seat.Available === 0}
            onClick={() => toggleSeat(seat.seat_id)}
          >
            {seat["Seat Row"]}
            {seat["Seat Number"]}
            {selectedSeats.includes(seat.seat_id) && " (Vald)"}
          </button>
        ))}

        <p>
          Valda sittplatser: {selectedSeats.length} av {totalTickets}
        </p>
      </section>

      <section>
        <h2>Din bokning</h2>
        {showing && (
          <>
            <p>Film: {showing.Movie}</p>
            <p>
              Visning: {showing["Screening Date"]} kl. {showing["Start Time"]}
            </p>
            <p>Salong: {showing.Screen}</p>
            <p>Biljetter: {totalTickets} st</p>
            <p>
              Platser:{" "}
              {seats
                .filter((seat) => selectedSeats.includes(seat.seat_id))
                .map((seat) => `${seat["Seat Row"]}${seat["Seat Number"]}`)
                .join(", ") || "Inga platser valda"}
            </p>
            <p>Totalt: {totalPrice} kr</p>
          </>
        )}

        <label htmlFor="email">E-postadress</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="namn@exempel.se"
          required
        />
        {error && <p>{error}</p>}
        <button type="button" onClick={handleBooking} disabled={isBooking}>
          {isBooking ? "Bokar..." : "Bekräfta bokning"}
        </button>
      </section>
    </main>
  );
}

export default BookingPage;
