const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },

  method: {
    type: String,
    enum: ["card", "upi", "netbanking", "cash"],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    required: true
  },

  transactionId: {
    type: String,
    required: true
  }

}, { timestamps: true });
module.exports = mongoose.model("Payment", paymentSchema);