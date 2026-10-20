const nodemailer = require("nodemailer");

// create connection to the email server using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send booking confirmation email
async function sendBookingConfirmation(toEmail, confirmation) {
  // Format the list of seats (supports array of tickets or concatenated string)
  let ticketsList = "";

  if (Array.isArray(confirmation.tickets)) {
    ticketsList = confirmation.tickets
      .map(
        (t) =>
          `<li>Rad ${t.seat_row} Plats ${t.seat_number} (${t.ticket_type}: ${t.price} kr)</li>`,
      )
      .join("");
  } else if (confirmation.seats_and_prices || confirmation.platser_och_priser) {
    const rawSeats =
      confirmation.seats_and_prices || confirmation.platser_och_priser;
    ticketsList = rawSeats
      .split(", ")
      .map((item) => `<li>${item}</li>`)
      .join("");
  } else {
    ticketsList = "<li>Inga platser angivna</li>";
  }

  // Extract booking details with clean fallbacks
  const movieTitle =
    confirmation.movie_title ||
    confirmation.show?.title ||
    confirmation.filmtitel ||
    "Film";
  const bookingNum = confirmation.booking_number || confirmation.bokningsnummer;
  const showDate =
    confirmation.show_date ||
    confirmation.show?.date ||
    confirmation.visningsdatum;
  const showTime =
    confirmation.show_time ||
    confirmation.show?.time ||
    confirmation.visningstid;
  const total =
    confirmation.total_price ||
    confirmation.totalPrice ||
    confirmation.totalt_pris;

  const mailOptions = {
    from: '"Regalia" <no-reply@regalia.se>',
    to: toEmail,
    subject: `Bokningsbekräftelse - ${bookingNum}`,
    html: `
      <h2>Tack, vi ses i salongen!</h2>
      <p>Här är dina bokningsdetaljer:</p>
      <ul>
        <li><strong>Film:</strong> ${movieTitle}</li>
        <li><strong>Bokningsnummer:</strong> ${bookingNum}</li>
        <li><strong>Datum & Tid:</strong> ${showDate} kl. ${showTime}</li>
      </ul>
      <p><strong>Platser:</strong></p>
      <ul>
        ${ticketsList}
      </ul>
      <p><strong>Totalt pris:</strong> ${total} kr</p>
      <p>Välkommen!</p>
      <p>Uppge bokningsnumret vid ankomst.</p>
    `,
  };

  //send the email via the transporter
  const info = await transporter.sendMail(mailOptions);

  // log the preview URL for testing purposes
  console.log(
    "E-post skickat! Förhandsgranska här: %s",
    nodemailer.getTestMessageUrl(info),
  );
}

module.exports = { sendBookingConfirmation };
