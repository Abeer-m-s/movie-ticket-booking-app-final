const Show = require("../models/Show");

exports.createShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json(show);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getShows = async (req, res) => {
  const shows = await Show.find()
    .populate("movie")
    .populate("theatre");
  res.json(shows);
};