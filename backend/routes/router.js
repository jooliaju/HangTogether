const express = require("express");
const router = express.Router();
const schemas = require("../model/schema");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/users", async (req, res) => {
  try {
    const userData = new schemas.Users({
      userId: req.body.userId,
      userName: req.body.userName,
      email: req.body.email,
    });

    const newUser = new schemas.Users(userData);
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
