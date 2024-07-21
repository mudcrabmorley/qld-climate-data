const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticate, authorize } = require("../middleware/auth");

console.log("authenticate", authenticate);
console.log("authorize", authorize);

//* POST REQUESTS

// Insert a new user
router.post("/new", authenticate, authorize(["Teacher"]), async (req, res) => {
  const { email, password, role } = req.body;
  const user = new User({ email, password, role });
  await user.save();
  res.status(201).send(user);
});

// * PUT REQUESTS

// Update access level for at least two users in the same query, based on a date range in which the users were created
router.put(
  "/access",
  authenticate,
  authorize(["Teacher"]),
  async (req, res) => {
    try {
      const { startDate, endDate, newRole } = req.body;
      const updatedUsers = await User.updateMany(
        { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { role: newRole }
      );
      res.status(200).send(updatedUsers);
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// * DELETE REQUESTS

// Delete a user by ID
router.delete(
  "/:id",
  authenticate,
  authorize(["Teacher"]),
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).send();
  }
);

// Delete multiple users that have the "User" role and last logged in between two given dates
router.delete("/", authenticate, authorize(["Teacher"]), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    await User.deleteMany({
      role: "User",
      lastLogin: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
