const jwt = require("jsonwebtoken");
const user = require("../models/User");

// Middleware function for authentication
exports.authenticate = (req, res, next) => {
  console.log("Authenticate middleware called");

  // Check if token exists
  if (!req.header("Authorization")) {
    return res
      .status(401)
      .send("Access denied. No Authorization header provided.");
  }

  // Extract the token from the Authorization header
  const token = req.header("Authorization").replace("Bearer ", "");

  // Check if token exists
  if (!token) {
    return res.status(401).send("Access denied. No token provided");
  }

  try {
    // Verify the token using the secret key from environment variables
    console.log("JWT Secret Key:", process.env.JWT_SECRET_KEY);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Call the next middleware function
    next();
  } catch (err) {
    console.log("Authentication error:", err.message);
    res.status(401).send("Invalid token");
  }
};

// Middleware function for authorization
exports.authorize = (roles) => (req, res, next) => {
  console.log("Authorize middleware called");
  // Check if the user's role is included in the allowed roles
  if (!roles.includes(req.user.role)) {
    return res.status(403).send("Access denied");
  }

  // Call the next middleware function
  next();
};
