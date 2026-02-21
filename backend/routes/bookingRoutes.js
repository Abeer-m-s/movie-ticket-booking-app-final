const express = require("express");
const router = express.Router();

const { auth, authorizeRoles } = require("../middleware/authMiddleware");
const { createBooking } = require("../controllers/bookingController");

// Only user can book tickets
router.post(
  "/",
  auth,
  authorizeRoles("user"),
  createBooking
);

module.exports = router;