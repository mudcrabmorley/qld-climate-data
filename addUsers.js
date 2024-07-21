const mongoose = require("mongoose");
const User = require("./climate-data-api/src/models/User");

async function addUsers() {
  await mongoose.connect("mongodb://localhost:27017/weather_db");

  const users = [
    { email: "teacher@example.com", password: "password123", role: "Teacher" },
    { email: "user@example.com", password: "password123", role: "User" },
    { email: "sensor@example.com", password: "password123", role: "Sensor" },
  ];

  for (let user of users) {
    console.log(`Password for ${user.email}: ${user.password}`);
    const newUser = new User(user);
    await newUser.save();
    console.log(`User ${user.email} added with password ${user.password}`);
  }

  console.log("Users added successfully");
  mongoose.disconnect();
}

addUsers().catch((err) => console.error(err));
