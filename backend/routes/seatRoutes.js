const express = require("express");
const router = express.Router();

const { auth, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createSeat,
  getSeatsByShow
} = require("../controllers/seatController");

// Admin can create seats
router.post("/", auth, authorizeRoles("admin"), createSeat);

// Get seats for a specific show
router.get("/:showId", getSeatsByShow);

module.exports = router;    