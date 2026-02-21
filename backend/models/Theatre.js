const mongoose = require("mongoose");
const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  totalScreens: {
    type: Number,
    required: true,
    min: 1
  }

}, { timestamps: true });
module.exports = mongoose.model("Theatre", theatreSchema);