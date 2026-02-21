const express = require("express");
const router = express.Router();

const { auth, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createTheatre,
  getTheatres
} = require("../controllers/theatreController");

// Create theatre (Admin only)
router.post(
  "/",
  auth,
  authorizeRoles("admin"),
  createTheatre
);

// Get all theatres
router.get("/", getTheatres);

module.exports = router;