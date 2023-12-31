const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  _id: { type: String, required: true },
  userName: { type: String, required: false },
  gameMemberOf: { type: String, required: false },
  email: { type: String, required: true },
  partner: { type: String, required: false },
});

const gamesSchema = new Schema({
  partner1: {
    //partner1 is the person who sent the invite
    id: { type: String, required: true },
    wordToGuess: { type: String, required: false },
  },
  partner2: {
    //partner2 is the person who accepted the invite
    id: { type: String, required: true },
    wordToGuess: { type: String, required: false },
  },
  dateStarted: { type: Date, required: true },
  activeStatus: { type: Boolean, required: true }, //this changes if someone removes the game
  wordOfTheDay: { type: String, required: false },
});

const Users = mongoose.model("Users", usersSchema, "users");
const Games = mongoose.model("Games", gamesSchema, "games");

const schemas = { Users: Users, Games: Games };

module.exports = schemas;
