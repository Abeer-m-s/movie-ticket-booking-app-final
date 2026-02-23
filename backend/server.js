const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ================= ROUTES =================

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

// User Routes
app.use("/api/users", require("./routes/userRoutes"));

// Admin Routes
app.use("/api/admin", require("./routes/adminRoutes"));

// Movie Routes
app.use("/api/movies", require("./routes/movieRoutes"));

// Show Routes
app.use("/api/shows", require("./routes/showRoutes"));

// Booking Routes
app.use("/api/bookings", require("./routes/bookingRoutes"));

//theatre Routes
app.use("/api/theatres", require("./routes/theatreRoutes"));

// seat Routes
app.use("/api/seats", require("./routes/seatRoutes"));

// ==========================================

// Root Route
app.get("/", (req, res) => {
  res.send("🎬 Movie Ticket Booking API Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.post("/test", (req, res) => {
  res.send("Test route works");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong"
  });
});