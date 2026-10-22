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
  const movieTitle = confirmation["Movie"] || "Film";
  const bookingNum = confirmation["Booking Number"];
  const showDate = confirmation["Screening Date"];
  const showTime = confirmation["Start Time"];
  const total = confirmation["Total Price (SEK)"] || 0;

  // Format the list of seats (supports database view "Platser" string, array of tickets, or fallback)
  let ticketsList = "";
  const seatsData =
    confirmation["Platser"] ||
    confirmation["Seats"] ||
    confirmation.seats_and_prices ||
    confirmation.platser_och_priser;

  if (seatsData) {
    ticketsList = seatsData
      .split(", ")
      .map((item) => `<li>${item}</li>`)
      .join("");
  } else if (Array.isArray(confirmation.tickets)) {
    ticketsList = confirmation.tickets
      .map(
        (t) =>
          `<li>Rad ${t.seat_row} Plats ${t.seat_number} (${t.ticket_type}: ${t.price} kr)</li>`,
      )
      .join("");
  } else {
    ticketsList = "<li>Inga platser angivna</li>";
  }

  const mailOptions = {
    from: '"Regalia" <no-reply@regalia.se>',
    to: toEmail,
    subject: `Bokningsbekräftelse - ${bookingNum}`,
    html: `
      <h1>Bokningsbekräftelse</h1>
      <p>Tack för din bokning! Här är dina bokningsdetaljer:</p>
      <ul>
        <li><strong>Film:</strong> ${movieTitle}</li>
        <li><strong>Bokningsnummer:</strong> ${bookingNum}</li>
        <li><strong>Datum:</strong> ${showDate}</li>
        <li><strong>Tid:</strong> ${showTime}</li>
        <li><strong>Totalt pris:</strong> ${total} kr</li>
      </ul>
      <p><strong>Platser:</strong></p>
      <ul>
        ${ticketsList}
      </ul>
      <p>Välkommen! Uppge bokningsnumret vid ankomst.</p>
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
