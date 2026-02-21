const Seat = require("../models/Seat");

// Create single seat
exports.createSeat = async (req, res) => {
  try {
    const seat = await Seat.create(req.body);
    res.status(201).json(seat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get seats by show
exports.getSeatsByShow = async (req, res) => {
  try {
    const seats = await Seat.find({ show: req.params.showId });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};