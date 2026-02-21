const mongoose = require("mongoose");
const seatSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true
  },

  seatNumber: {
    type: String,
    required: true
  },

  seatType: {
    type: String,
    enum: ["regular", "premium", "vip"],
    default: "regular"
  },

  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available"
  }

}, { timestamps: true });
module.exports = mongoose.model("Seat", seatSchema);