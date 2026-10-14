function calculateTicketTotal(selectedTickets, ticketTypesFromDB) {
  let total = 0;
  let totalQuantity = 0;

  for (const item of selectedTickets) {
    const ticketType = ticketTypesFromDB.find(
      (ticket) => ticket.id === item.ticketTypeId,
    );

    if (!ticketType) {
      throw new Error(`Ogiltig biljetttyp ${item.ticketTypeId}.`);
    }

    if (item.quantity < 0) {
      throw new Error(
        `Du måste välja minst en biljett av typen ${item.ticketTypeId}.`,
      );
    }

    total += ticketType.price * item.quantity;
    totalQuantity += item.quantity;
  }

  return { total, totalQuantity };
}

module.exports = calculateTicketTotal;
