const express = require("express");
const router = express.Router();

const { auth, authorizeRoles } = require("../middleware/authMiddleware");
const {
  createMovie,
  getMovies,
  getMovieById,
  deleteMovie
} = require("../controllers/movieController");

router.post("/", auth, authorizeRoles("admin"), createMovie);
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.delete("/:id", auth, authorizeRoles("admin"), deleteMovie);

module.exports = router;