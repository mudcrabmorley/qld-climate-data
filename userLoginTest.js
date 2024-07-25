const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://jakemorley:jakemorley@qldweather.wio72ua.mongodb.net/?retryWrites=true&w=majority&appName=qldWeather"
  )
  .then(() => {
    console.log("Connected to MongoDB");

    // Create TTL index
    const User = mongoose.model(
      "User",
      new mongoose.Schema({}),
      "user_collection"
    );
    User.collection.createIndex(
      { lastLogin: 1 },
      { expireAfterSeconds: 2592000 },
      (err, result) => {
        if (err) {
          console.error("Error creating TTL index:", err);
        } else {
          console.log("TTL index created:", result);
        }
      }
    );
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
