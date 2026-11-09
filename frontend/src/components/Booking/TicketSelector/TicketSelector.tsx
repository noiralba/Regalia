import type { TicketType } from "../../../types/types";
import "./TicketSelector.scss";

interface TicketSelectorProps {
  ticketTypes: TicketType[];
  ticketCounts: Record<string, number>;
  totalPrice: number;
  onChangeCount: (ticketTypeId: string, change: number) => void;
}

function TicketSelector({
  ticketTypes,
  ticketCounts,
  totalPrice,
  onChangeCount,
}: TicketSelectorProps) {
  return (
    <section className="ticket-selector">
      <h2>Välj biljetter</h2>
      {ticketTypes.map((ticket) => (
        <article className="ticket-selector__row" key={ticket.ticket_type_id}>
          <h3>{ticket["Ticket Type"]}</h3>
          <p>{Number(ticket["Price (SEK)"])} kr</p>
          <button
            type="button"
            onClick={() => onChangeCount(ticket.ticket_type_id, -1)}
            disabled={!ticketCounts[ticket.ticket_type_id]}
          >
            -
          </button>
          <span>{ticketCounts[ticket.ticket_type_id] || 0}</span>
          <button
            type="button"
            onClick={() => onChangeCount(ticket.ticket_type_id, 1)}
          >
            +
          </button>
        </article>
      ))}
      <p className="ticket-selector__total">Totalt: {totalPrice} kr</p>
    </section>
  );
}

export default TicketSelector;
