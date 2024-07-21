const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Teacher", "User", "Sensor"], required: true },
});

// Middleware function that runs before saving a user to the database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log("Hashing password for", this.email);
    this.password = await bcrypt.hash(this.password, 10);
    console.log("Hashed password:", this.password);
  }
  next();
});

// Method to compare a candidate password with the user's hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log("Comparing passwords...");
  const match = await bcrypt.compare(candidatePassword, this.password);
  console.log(
    `Password match result for ${candidatePassword} and ${this.password}: ${match}`
  );
  return match;
};

// Create the User model using the user schema
const User = mongoose.model("User", userSchema, "user_collection");

// Export the User model
module.exports = User;
