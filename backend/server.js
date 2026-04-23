const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/feedback", require("./modules/feedback/routes/feedbackRoutes"));
app.use("/api/consultations", require("./modules/consultation/routes/consultationRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Smart Clinic - Feedback & Rating API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
