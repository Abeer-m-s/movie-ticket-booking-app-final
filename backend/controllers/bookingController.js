const Booking = require("../models/Booking");
const Seat = require("../models/Seat");
const Show = require("../models/Show");
const Payment = require("../models/Payment");
const { sendBookingConfirmationEmail } = require("../utils/email");

exports.createBooking = async (req, res) => {
  try {
    const { showId, seatIds, paymentMethod } = req.body;

    if (!showId || !seatIds || seatIds.length === 0) {
      return res.status(400).json({
        message: "Show ID and seats are required"
      });
    }

    // 1️⃣ Find available seats
    const seats = await Seat.find({
      _id: { $in: seatIds },
      status: "available"
    });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({
        message: "Some seats are already booked"
      });
    }

    // 2️⃣ Find show
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const totalAmount = show.ticketPrice * seats.length;

    // 3️⃣ Mark seats as booked
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      { status: "booked" }
    );

    // 4️⃣ Create booking
    const booking = await Booking.create({
      user: req.user.id,
      show: showId,
      seats: seatIds,
      totalAmount
    });

    // 5️⃣ Create payment
    const payment = await Payment.create({
      booking: booking._id,
      method: paymentMethod || "card",
      paymentStatus: "completed",
      transactionId: "TXN" + Date.now()
    });

    // 6️⃣ Send ticket email (non-blocking for failure)
    try {
      const fullBooking = await Booking.findById(booking._id)
        .populate("user", "name email")
        .populate({
          path: "show",
          populate: [
            { path: "movie", select: "title language duration" },
            { path: "theatre", select: "name location" }
          ]
        })
        .populate("seats", "seatNumber seatType");

      await sendBookingConfirmationEmail(fullBooking, payment);
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError);
    }

    res.status(201).json({
      message: "Booking successful",
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};