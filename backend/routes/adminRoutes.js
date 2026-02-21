const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");

const { auth, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Admin Dashboard
router.get(
  "/check-admin",
  auth,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Admin verified" });
  }
);

// ✅ Create Theatre Manager (Admin Only)
router.post(
  "/create-theatre-manager",
  auth,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, password, theatreId } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const manager = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "theatreManager",
        theatre: theatreId
      });

      res.status(201).json({
        message: "Theatre Manager created successfully",
        manager
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;