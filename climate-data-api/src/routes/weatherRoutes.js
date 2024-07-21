const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate); // Middleware to authenticate all routes

// * GET REQUESTS

// Get maximum precipitation recorded in the last 5 months for a specific sensor - accessible to "User" and "Teacher" roles
console.log("Loading routes...");

router.get(
  "/max-precipitation/:deviceName",
  (req, res, next) => {
    console.log(`Request for device: ${req.params["deviceName"]}`);
    next();
  },
  authorize(["User", "Teacher"]),
  weatherController.getMaxPrecipitation
);

// Get a database projection of a single record - accessible to "User" and "Teacher" roles
router.get(
  "/projection/:id",
  authorize(["User", "Teacher"]),
  weatherController.getWeatherProjection
);

// Get records by 'Device' and 'Time' index - accessible to "User" and "Teacher" roles
router.get("/by-device-and-time", weatherController.getWeatherByDeviceAndTime);

// Get maximum temperature recorded for all stations for a given Date/Time range - accessible to "User" and "Teacher" roles
router.get(
  "/max-temperature",
  authorize(["User", "Teacher"]),
  weatherController.getMaxTemperature
);

// Get weather data by ID - accessible to "User" and "Teacher" roles
router.get(
  "/:id",
  authorize(["User", "Teacher"]),
  weatherController.getWeatherById
);

// Get all weather data - accessible to "User" and "Teacher" roles
router.get(
  "/",
  authorize(["User", "Teacher"]),
  weatherController.getAllWeather
);

// * POST REQUESTS

// Create weather data - accessible to "Sensor" role
router.post("/add", authorize(["Sensor"]), weatherController.createWeather);

// Create multiple weather data entries at once - accessible to "Sensor" role
router.post(
  "/add-bulk",
  authorize(["Sensor"]),
  weatherController.createMultipleWeathers
);

// * PUT REQUESTS

// Update weather data by ID - accessible to "Teacher" role
router.put(
  "/update/:id",
  authorize(["Teacher"]),
  weatherController.updateWeatherById
);

// Update multiple weather data entries at once - accessible to "Teacher" role
router.put(
  "/update-bulk",
  authorize(["Teacher"]),
  weatherController.updateMultipleWeathers
);

// * DELETE REQUESTS

// Delete weather data by ID - accessible to "Teacher" role
router.delete(
  "/remove/:id",
  authorize(["Teacher"]),
  weatherController.deleteWeatherById
);

// Delete multiple weather data entries at once - accessible to "Teacher" role
router.delete(
  "/remove-bulk",
  authorize(["Teacher"]),
  weatherController.deleteMultipleWeathers
);

module.exports = router;
