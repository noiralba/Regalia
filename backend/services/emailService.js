const emailjs = require("@emailjs/nodejs");

// Sends a booking confirmation email to the user with the provided order data.
async function sendBookingConfirmation(toEmail, orderData) {
  const templateParams = {
    to_email: toEmail,
    booking_number: orderData["Booking Number"],
    movie_title: orderData["Movie"],
    show_date: orderData["Screening Date"],
    show_time: orderData["Start Time"],
    screens: orderData["Screen"],
    seats_list: orderData["Seats"],
    total_price: orderData["Total Price (SEK)"],
  };

  // a try-catch block is used to handle any errors that may occur during the email sending process.
  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      },
    );
    console.log(
      "Bekräftelsemail skickat med framgång!",
      response.status,
      response.text,
    );
    return response;
  } catch (error) {
    console.error("Fel vid utskick av e-post:", error);
    throw error;
  }
}

module.exports = { sendBookingConfirmation };
