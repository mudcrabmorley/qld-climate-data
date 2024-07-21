const mongoose = require("mongoose");

// Define the weather schema using mongoose.Schema
const weatherSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    "Device Name": String,
    "Precipitation mm/h": Number,
    Time: Date,
    Latitude: Number,
    Longitude: Number,
    "Temperature (°C)": Number,
    "Atmospheric Pressure (kPa)": Number,
    "Max Wind Speed (m/s)": Number,
    "Solar Radiation (W/m2)": Number,
    "Vapor Pressure (kPa)": Number,
    "Humidity (%)": Number,
    "Wind Direction (°)": Number,
  },
  { collection: "weather_collection" }
);

// Create a Weather model using the weather schema
const Weather = mongoose.model("Weather", weatherSchema);

// Export the Weather model
module.exports = Weather;
