const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const appointmentRoutes = require("./routers/appointmentRoutes");
const partnershipRoutes = require("./routers/partnershipRoutes");
const dbConnect = require("./lib/dbConnect");
const reviewRoutes = require("./routers/reviewRoutes")

const app = express();
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB connection
dbConnect().then(() => {
  console.log("MongoDB connected");
}).catch(err => console.error('MongoDB connection error:', err));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the ND Healthcare API" });
});

app.use("/api", appointmentRoutes);
app.use("/api/partnerships", partnershipRoutes);
app.use("/api/reviews", reviewRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});