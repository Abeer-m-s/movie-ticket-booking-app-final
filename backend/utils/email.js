const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.warn("Email config missing (EMAIL_HOST/EMAIL_USER/EMAIL_PASS). Ticket emails will not be sent.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT) || 587,
    secure: EMAIL_SECURE === "true",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  return transporter;
}

async function sendBookingConfirmationEmail(booking, payment) {
  const transporterInstance = getTransporter();
  if (!transporterInstance) return;

  const user = booking.user;
  const show = booking.show;
  const movie = show.movie;
  const theatre = show.theatre;
  const seats = booking.seats || [];

  const seatList = seats.map((s) => `${s.seatNumber} (${s.seatType})`).join(", ");

  const showTime = new Date(show.showDateTime).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const subject = `Your ticket for ${movie.title} - ${theatre.name}`;

  const lines = [
    `Hi ${user.name},`,
    "",
    "Your booking is confirmed. Here are your ticket details:",
    "",
    `Movie: ${movie.title}`,
    `Theatre: ${theatre.name} (${theatre.location})`,
    `Show time: ${showTime}`,
    `Seats: ${seatList}`,
    `Tickets: ${seats.length}`,
    `Amount paid: ₹${booking.totalAmount}`,
    "",
    `Payment method: ${payment.method}`,
    `Transaction ID: ${payment.transactionId}`,
    "",
    `Booking ID: ${booking._id}`,
    "",
    "Please arrive at the venue 15-20 minutes before the show time.",
    "",
    "Enjoy your movie!",
    "ANIMOV"
  ];

  const text = lines.join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <p>Hi ${user.name},</p>
      <p>Your booking is confirmed. Here are your ticket details:</p>
      <ul>
        <li><strong>Movie:</strong> ${movie.title}</li>
        <li><strong>Theatre:</strong> ${theatre.name} (${theatre.location})</li>
        <li><strong>Show time:</strong> ${showTime}</li>
        <li><strong>Seats:</strong> ${seatList}</li>
        <li><strong>Tickets:</strong> ${seats.length}</li>
        <li><strong>Amount paid:</strong> ₹${booking.totalAmount}</li>
        <li><strong>Payment method:</strong> ${payment.method}</li>
        <li><strong>Transaction ID:</strong> ${payment.transactionId}</li>
        <li><strong>Booking ID:</strong> ${booking._id}</li>
      </ul>
      <p>Please arrive at the venue 15-20 minutes before the show time.</p>
      <p>Enjoy your movie!<br/>ANIMOV</p>
    </div>
  `;

  await transporterInstance.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: user.email,
    subject,
    text,
    html
  });
}

module.exports = {
  sendBookingConfirmationEmail
};

