/**
 * Seed script: Add sample anime movies, theatres, shows, and seats.
 * Run: node seed.js (from backend folder, with MongoDB running)
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Movie = require("./models/Movie");
const Theatre = require("./models/Theatre");
const Show = require("./models/Show");
const Seat = require("./models/Seat");
const User = require("./models/User");

connectDB();

async function seed() {
  try {
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Show.deleteMany({});
    await Seat.deleteMany({});

    const movies = await Movie.insertMany([
      {
        title: "Demon Slayer",
        genre: "Action, Fantasy, Adventure",
        language: "Japanese",
        duration: 117,
        rating: 8.2,
        description:
          "Tanjiro and his friends board the Mugen Train to assist the Flame Hashira in hunting a demon that has killed many demon slayers.",
        poster: "https://i.pinimg.com/736x/0a/64/c3/0a64c3e5810287b16d4cd149c98240cf.jpg",
      },
      {
        title: "Your Name",
        genre: "Romance, Fantasy, Drama",
        language: "Japanese",
        duration: 106,
        rating: 8.2,
        description:
          "Two teenagers share a profound, magical connection upon discovering they are swapping bodies. A beautiful story of love across time and space.",
        poster: "https://i.pinimg.com/1200x/32/0a/b7/320ab7994967c304099d49b9ba405a70.jpg",
      },
      {
        title: "Spirited Away",
        genre: "Adventure, Fantasy",
        language: "Japanese",
        duration: 125,
        rating: 8.6,
        description:
          "During her family's move, young Chihiro enters a world of spirits. She must work to free her parents and find a way back to the human world.",
        poster: "https://i.pinimg.com/736x/6a/e6/19/6ae619dffb505316c146d1d7c6b006a4.jpg",
      },
      {
        title: "Howl's Moving Castle",
        genre: "Fantasy, Romance, Adventure",
        language: "Japanese",
        duration: 119,
        rating: 8.2,
        description:
          "Young Sophie is cursed by a witch and transformed into an old woman. She finds refuge in the magical moving castle of the wizard Howl.",
        poster: "https://i.pinimg.com/1200x/d7/c0/82/d7c082805c7fbe08b2b5298314075d8d.jpg",
      },
      {
        title: "Weathering With You",
        genre: "Romance, Fantasy, Drama",
        language: "Japanese",
        duration: 112,
        rating: 7.9,
        description:
          "A high school boy runs away to Tokyo and befriends an orphan girl who has the ability to control the weather.",
        poster: "https://i.pinimg.com/1200x/08/53/77/085377334fcb7f132de1908d72f7b02c.jpg",
      },
    ]);

    const theatres = await Theatre.insertMany([
      { name: "Anime Central", location: "Downtown", totalScreens: 3 },
      { name: "Otaku Cinema", location: "Mall of Dreams", totalScreens: 2 },
    ]);

    const shows = [];
    for (const movie of movies) {
      for (const theatre of theatres) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(14, 0, 0);
        shows.push(
          await Show.create({
            movie: movie._id,
            theatre: theatre._id,
            showDateTime: d,
            ticketPrice: 250,
          })
        );
        const d2 = new Date(d);
        d2.setHours(19, 0, 0);
        shows.push(
          await Show.create({
            movie: movie._id,
            theatre: theatre._id,
            showDateTime: d2,
            ticketPrice: 300,
          })
        );
      }
    }

    for (const show of shows) {
      const rows = ["A", "B", "C", "D", "E"];
      for (const row of rows) {
        for (let i = 1; i <= 8; i++) {
          await Seat.create({
            show: show._id,
            seatNumber: `${row}${i}`,
            seatType: row === "E" ? "vip" : row === "D" ? "premium" : "regular",
            status: "available",
          });
        }
      }
    }

    // Ensure default admin user exists
    const adminEmail = "admin@gmail.com";
    const adminPassword = "123456";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashed,
        role: "admin",
      });
      console.log("✅ Default admin user created (admin@gmail.com / 123456)");
    } else {
      console.log("ℹ️ Admin user already exists, skipping create");
    }

    console.log("✅ Seed complete: movies, theatres, shows, seats, and admin user ready.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
