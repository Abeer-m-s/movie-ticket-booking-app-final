const express = require("express");
const router = express.Router();

const { auth, authorizeRoles } = require("../middleware/authMiddleware");
const { createShow, getShows } = require("../controllers/showController");

router.post("/", auth, authorizeRoles("admin", "theatreManager"), createShow);
router.get("/", getShows);

module.exports = router;