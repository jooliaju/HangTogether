const express = require("express");
const router = express.Router();
const schemas = require("../model/schema");

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await schemas.Users.findById(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user
router.post("/", async (req, res) => {
  try {
    const userData = new schemas.Users({
      _id: req.body._id,
      userName: req.body.userName,
      email: req.body.email,
      gameMemberOf: req.body.gameMemberOf,
      partner: "",
    });

    const newUser = new schemas.Users(userData);
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
