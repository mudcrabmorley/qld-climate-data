const bcrypt = require("bcryptjs");

const password = "password123";
const hash = "$2a$10$zuJYUw.tb1zMHENq9DNBz.p1GFzgs3sw4dSqQPwP8bBYovCOq6c.2";

bcrypt.hash(password, 10, function (err, hashedPassword) {
  if (err) {
    console.error("Hashing error:", err);
    return;
  }
  console.log("Hashed Password:", hashedPassword);
  // Direct comparison for troubleshooting
  console.log("Hashes match directly:", hashedPassword === hash);

  bcrypt.compare(password, hash, function (err, isMatch) {
    if (err) {
      console.error("Comparison error:", err);
      return;
    }
    console.log("Password match:", isMatch);
  });
});
