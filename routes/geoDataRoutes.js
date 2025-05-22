const express = require("express");
const router = express.Router();
const {
  getGeoData,
  createGeoData,
  getAllGeoData,
  getGeoDataById,
} = require("../controllers/geoDataController");

// Route to fetch external geospatial data (OpenStreetMap Nominatim)
router.get("/external", getGeoData);

// Route to store geospatial data in the database
router.post("/", createGeoData);

// Route to retrieve all stored data with optional filters
router.get("/", getAllGeoData);

// Route to retrieve a specific entry by ID
router.get("/:id", getGeoDataById);

module.exports = router;
