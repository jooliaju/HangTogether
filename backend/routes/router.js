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

//get a user by id
router.get("/users/:userId", async (req, res) => {
  try {
    const user = await schemas.Users.findById(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/users", async (req, res) => {
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

//get game for a user
router.get("/games/:gameId", async (req, res) => {
  try {
    const game = await schemas.Games.findById(req.params.gameId);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/newgame", async (req, res) => {
  const dateTime = new Date();
  // Create a function to update partner information
  const updatePartnerInfo = async (userId, newData) => {
    try {
      // Perform the update for the given user ID
      await schemas.Users.updateOne({ _id: userId }, newData);
      console.log(`Partner info updated for user: ${userId}`);
    } catch (error) {
      console.error(`Error updating partner info for user: ${userId}`);
    }
  };

  try {
    console.log(req.body);
    const gameData = new schemas.Games({
      partner1: {
        //partner1 is the person who sent the invite
        id: req.body.partner1,
        wordToGuess: req.body.partner1WordToGuess,
      },
      partner2: {
        //partner2 is the person who accepted the invite
        id: req.body.partner2,
        wordToGuess: req.body.partner2WordToGuess,
      },
      dateStarted: dateTime,
      activeStatus: true,
    });

    const newGame = new schemas.Games(gameData);
    const savedGame = await newGame.save();

    console.log(savedGame._id);

    // Update partneruser info to add game ID they're now a member of
    await updatePartnerInfo(req.body.partner1, {
      gameMemberOf: savedGame._id,
      partner: req.body.partner2,
    });
    await updatePartnerInfo(req.body.partner2, {
      gameMemberOf: savedGame._id,
      partner: req.body.partner1,
    });

    res.status(201).json(savedGame);
    console.log("New game created!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//mailing logic
// Invitation endpoint
router.post("/invite", async (req, res) => {
  const recipientEmail = req.body.recipientEmail;
  const senderId = req.body.senderId;
  const wordForPartner2 = req.body.wordToGuess;

  const tokenData = {
    recipientEmail: recipientEmail,
    whoSentInvite: senderId,
    wordForPartner2: wordForPartner2,
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
