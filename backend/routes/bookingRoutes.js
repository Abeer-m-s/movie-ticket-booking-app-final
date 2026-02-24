const express = require("express");
const router = express.Router();

const { auth, authorizeRoles } = require("../middleware/authMiddleware");
const { createBooking, getMyBookings } = require("../controllers/bookingController");

// Only user can book tickets
router.post(
  "/",
  auth,
  authorizeRoles("user"),
  createBooking
);

// Logged-in user can view their own bookings
router.get(
  "/my",
  auth,
  authorizeRoles("user"),
  getMyBookings
);

module.exports = router;