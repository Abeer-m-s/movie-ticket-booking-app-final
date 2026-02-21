const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  genre: {
    type: String,
    required: true
  },

  language: {
    type: String,
    required: true
  },

  duration: {
    type: Number,
    required: true,
    min: 1
  },

  rating: {
    type: Number,
    min: 0,
    max: 10
  },

  description: String,

  poster: String

}, { timestamps: true });
module.exports = mongoose.model("Movie", movieSchema);