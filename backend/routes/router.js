const express = require("express");
const router = express.Router();
const schemas = require("../model/schema");
const generateToken = require("./helpers");
const mailerModule = require("./mailer");
const transporter = mailerModule.transporter;
const getEmailDetails = mailerModule.getEmailDetails;

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

router.post("/newgame", async (req, res) => {
  const dateTime = new Date();

  try {
    const gameData = new schemas.Games({
      partner1: req.body.partner1,
      partner2: req.body.partner2,
      dateStarted: dateTime,
      activeStatus: true,
    });

    const newGame = new schemas.Games(gameData);
    const savedGame = await newGame.save();

    res.status(201).json(savedGame);
    console.log("New game created!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//mailing logic
// Invitation endpoint
router.post("/invite", async (req, res) => {
  const recipientEmail = req.body.recipientEmail;
  const gameId = req.body.gameId;
  const senderId = req.body.senderId;

  const tokenData = {
    recipientEmail: recipientEmail,
    whoSentInvite: senderId,
    gameId: gameId,
  };
  const token = generateToken(tokenData);

  const mailOptions = getEmailDetails(recipientEmail, token);

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("Failed to send invitation.");
    } else {
      console.log("Email sent: " + info.response);
      res.send("Invitation sent successfully!");
    }
  });
});

module.exports = router;
