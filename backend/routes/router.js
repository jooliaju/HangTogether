const express = require("express");
const router = express.Router();
const gameRoutes = require("./gameRoutes");
const userRoutes = require("./userRoutes");
const mailRoutes = require("./mailRoutes");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

// Mount the routes
router.use("/games", gameRoutes);
router.use("/users", userRoutes);
router.use("/invite", mailRoutes);

module.exports = router;
