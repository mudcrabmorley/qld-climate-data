const mongoose = require("mongoose");
const Weather = require("../models/Weather");

//* GET REQUEST

// Retrieve a single record
exports.getWeatherById = async (req, res) => {
  console.log("Inside GET /weather/:id handler with ID:", req.params.id); // Log the ID being requested
  const { id } = req.params;
  console.log("Searching for ID:", id); // Logging the ID being searched
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    const weather = await Weather.findById(id);
    console.log("Weather found:", weather); // Logging the result
    if (!weather) {
      return res.status(404).send("Weather record not found");
    }
    res.status(200).json(weather);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve multiple records
exports.getAllWeather = async (req, res) => {
  try {
    const weather = await Weather.find();
    res.status(200).json(weather);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Database projection of single record (device name, time, temperature, and humidity)
exports.getWeatherProjection = async (req, res) => {
  try {
    const weather = await Weather.findById(req.params.id, {
      "Device Name": 1,
      Time: 1,
      "Temperature (°C)": 1,
      "Humidity (%)": 1,
      _id: 0,
    });
    if (!weather) {
      return res.status(404).send("Weather record not found");
    }
    res.status(200).json(weather);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Retrieve record by 'Device' and 'Time' index
exports.getWeatherByDeviceAndTime = async (req, res) => {
  try {
    const { deviceName, startTime } = req.query;

    // Convert startTime to a JavaScript Date object
    const startTimeDate = new Date(startTime);

    // Query the database for the record
    const weatherRecord = await Weather.findOne({
      "Device Name": deviceName,
      Time: startTimeDate,
    });

    if (weatherRecord) {
      res.json(weatherRecord);
    } else {
      res.status(404).send("Weather record not found");
    }
  } catch (error) {
    console.error("Error fetching weather record:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Find the maximum precipitation within the last 5 months from the latest record's date
exports.getMaxPrecipitation = async (req, res) => {
  const deviceName = req.params.deviceName;

  try {
    // Step 1: Find the latest record's date for the specified device
    const latestRecord = await Weather.findOne({ "Device Name": deviceName })
      .sort({ Time: -1 }) // Assuming "Time" is stored in a directly comparable format
      .limit(1);

    if (!latestRecord) {
      return res.status(404).send("No records found for the specified device.");
    }

    // Directly using the Time field, assuming it's in a directly comparable date format
    const latestDate = new Date(latestRecord.Time); // Adjusted to directly use the Time field
    const fiveMonthsAgo = new Date(latestDate);
    fiveMonthsAgo.setMonth(latestDate.getMonth() - 5);

    // Step 2 & 3: Querying within the last 5 months from the latest record's date
    const maxPrecipitationRecord = await Weather.find({
      "Device Name": deviceName,
      Time: { $gte: fiveMonthsAgo, $lte: latestDate }, // Adjusted to use the Time field directly
    })
      .sort({ "Precipitation mm/h": -1 })
      .limit(1);

    res.json(maxPrecipitationRecord);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Find the maximum temperature recorded for all stations for a given Date/Time range
exports.getMaxTemperature = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const weather = await Weather.find({
      Time: { $gte: new Date(startDate), $lte: new Date(endDate) },
    })
      .sort({ "Temperature (°C)": -1 })
      .limit(1);
    if (!weather) {
      return res.status(404).send("Weather record not found");
    }
    res.status(200).json(weather);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//* POST REQUESTS

exports.createWeather = async (req, res) => {
  try {
    // Convert fields like Time and _id to the correct format if necessary
    if (req.body.Time && req.body.Time.$date) {
      req.body.Time = new Date(req.body.Time.$date);
    }
    if (req.body._id && req.body._id.$oid) {
      req.body._id = req.body._id.$oid;
    }

    const weather = new Weather(req.body);
    await weather.save();
    console.log("New weather record:", weather); // For debugging
    res.status(201).json(weather);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
};

// Insert multiple records
exports.createMultipleWeathers = async (req, res) => {
  try {
    // Preprocess each record in req.body
    const processedRecords = req.body.map((record) => {
      // Convert Time to Date object if necessary
      if (record.Time && record.Time.$date) {
        record.Time = new Date(record.Time.$date);
      }
      // Convert _id to ObjectId if necessary
      if (record._id && record._id.$oid) {
        record._id = new mongoose.Types.ObjectId(record._id.$oid);
      }
      return record;
    });

    const weathers = await Weather.insertMany(processedRecords);
    console.log("Inserted records:", weathers); // For debugging
    res.status(201).json(weathers);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
};

//* PUT REQUESTS

// Update or replace a single record
exports.updateWeatherById = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedWeather = await Weather.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedWeather) {
      return res.status(404).send({ message: "Weather data not found." });
    }
    res.send(updatedWeather);
  } catch (error) {
    res.status(500).send({ message: "Error updating weather data." });
  }
};

// Update or replace multiple records
exports.updateMultipleWeathers = async (req, res) => {
  try {
    const updates = req.body;
    const results = [];
    const { ObjectId } = require("mongoose").Types;

    for (let update of updates) {
      const weather = await Weather.findByIdAndUpdate(
        new ObjectId(update.id),
        update.updateData,
        { new: true }
      );

      if (!weather) {
        results.push({
          error: `Weather record with id: ${update.id} not found`,
        });
        continue;
      }
      results.push(weather);
    }

    res.status(200).json(results);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send(err.message);
    } else {
      res.status(500).send(err.message);
    }
  }
};

//* DELETE REQUESTS

// Delete a single record
exports.deleteWeatherById = async (req, res) => {
  const { id } = req.params;

  try {
    const weather = await Weather.findByIdAndDelete(id);

    if (!weather) {
      return res.status(404).send("Weather record not found");
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Delete multiple records
exports.deleteMultipleWeathers = async (req, res) => {
  try {
    const ids = req.body.ids;
    await Weather.deleteMany({ _id: { $in: ids } });
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
