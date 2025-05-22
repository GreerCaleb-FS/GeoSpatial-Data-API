const axios = require("axios");
const GeoData = require("../models/GeoData");

// Fetch external geospatial data using OpenStreetMap Nominatim (no API key required)
exports.getGeoData = async (req, res, next) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Please provide latitude and longitude" });
  }
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      { params: { lat, lon, format: "json" } }
    );
    res.status(200).json({ data: response.data });
  } catch (err) {
    next(err);
  }
};

// Store geospatial data in MongoDB
exports.createGeoData = async (req, res, next) => {
  try {
    const { latitude, longitude, data } = req.body;
    if (latitude === undefined || longitude === undefined || !data) {
      return res
        .status(400)
        .json({ error: "latitude, longitude, and data are required" });
    }
    const geoData = new GeoData({ latitude, longitude, data });
    const saved = await geoData.save();
    res.status(201).json({ message: "GeoData saved", id: saved._id });
  } catch (err) {
    next(err);
  }
};

// Retrieve all stored geospatial data with optional filters
exports.getAllGeoData = async (req, res, next) => {
  try {
    const { startDate, endDate, lat, lon } = req.query;
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (lat && lon) {
      filter.latitude = Number(lat);
      filter.longitude = Number(lon);
    }
    const entries = await GeoData.find(filter);
    res.status(200).json({ data: entries });
  } catch (err) {
    next(err);
  }
};

// Retrieve a specific geospatial entry by ID
exports.getGeoDataById = async (req, res, next) => {
  try {
    const entry = await GeoData.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "GeoData not found" });
    }
    res.status(200).json({ data: entry });
  } catch (err) {
    next(err);
  }
};
