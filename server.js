require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const geoDataRoutes = require("./routes/geoDataRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Rate limiter (Bonus Challenge)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});
app.use(limiter);

// Mount routes
app.use("/api/geo-data", geoDataRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || "Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
