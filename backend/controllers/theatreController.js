const Theatre = require("../models/Theatre");

exports.createTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json(theatre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTheatres = async (req, res) => {
  const theatres = await Theatre.find();
  res.json(theatres);
};
