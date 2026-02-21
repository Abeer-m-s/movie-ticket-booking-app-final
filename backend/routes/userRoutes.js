const express = require("express");
const router = express.Router();

const { auth, authorizeRoles } = require("../middleware/authMiddleware");

// Profile
router.get("/profile", auth, (req, res) => {
  res.json({
    message: "User profile accessed",
    user: req.user
  });
});

// ✅ Check User
router.get(
  "/check-user",
  auth,
  authorizeRoles("user"),
  (req, res) => {
    res.json({ message: "User verified" });
  }
);

module.exports = router;