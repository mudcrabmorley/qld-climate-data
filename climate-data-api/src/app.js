require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const swaggerDocument = YAML.load(path.resolve(__dirname, "./swagger.yaml"));
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = 3000;

// CORS configuration
const corsOptions = {
  origin: "*", // Supported origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Supported methods
  allowedHeaders: ["Content-Type", "Authorization"], // Supported headers
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// ! LOCAL DATABASE CONNECTION
// Connect to MongoDB database
mongoose
  .connect(config.db.uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// ! ATLAS DATABASE CONNECTION
// mongoose.connect(
//   "mongodb+srv://jakemorley:jakemorley@qldweather.wio72ua.mongodb.net/?retryWrites=true&w=majority&appName=qldWeather"
// );

// Enable pre-flight requests for all routes
app.options("*", cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/weather", weatherRoutes);

// Live server response
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Catch-all 404 handler for any undefined routes
app.use((req, res) => {
  console.log("404 Error - Endpoint not found for URL:", req.originalUrl); // Log the URL that was not found
  res.status(404).send("Endpoint not found");
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send("Internal Server Error");
});

// Address log
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
