const express = require("express");
const router = express.Router();
const schemas = require("../model/schema");

// Get game by ID
router.get("/:gameId", async (req, res) => {
  try {
    const game = await schemas.Games.findById(req.params.gameId);
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all games for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const games = await schemas.Games.find({
      $or: [
        { "partner1.id": req.params.userId },
        { "partner2.id": req.params.userId },
      ],
    }).sort({ dateStarted: -1 });

    if (!games.length) {
      return res.json([]);
    }

    res.json(games);
  } catch (error) {
    console.error("Error fetching user games:", error);
    res
      .status(500)
      .json({ message: "Error fetching games", error: error.message });
  }
});

// Create new game
router.post("/new", async (req, res) => {
  const dateTime = new Date();
  try {
    const gameData = new schemas.Games({
      partner1: {
        id: req.body.partner1,
        wordToGuess: req.body.partner1WordToGuess,
      },
      partner2: {
        id: req.body.partner2,
        wordToGuess: req.body.partner2WordToGuess,
      },
      dateStarted: dateTime,
      activeStatus: true,
    });

    const newGame = new schemas.Games(gameData);
    const savedGame = await newGame.save();

    // Update both users' game membership
    await updatePartnerInfo(req.body.partner1, {
      gameMemberOf: savedGame._id,
      partner: req.body.partner2,
    });
    await updatePartnerInfo(req.body.partner2, {
      gameMemberOf: savedGame._id,
      partner: req.body.partner1,
    });

    res.status(201).json(savedGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function for updating partner info
async function updatePartnerInfo(userId, newData) {
  try {
    await schemas.Users.updateOne({ _id: userId }, newData);
    console.log(`Partner info updated for user: ${userId}`);
  } catch (error) {
    console.error(`Error updating partner info for user: ${userId}`);
  }
}

module.exports = router;
