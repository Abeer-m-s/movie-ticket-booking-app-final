const mongoose = require("mongoose");
const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true
  },

  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
    required: true
  },

  showDateTime: {
    type: Date,
    required: true
  },

  ticketPrice: {
    type: Number,
    required: true,
    min: 0
  }

}, { timestamps: true });
module.exports = mongoose.model("Show", showSchema);