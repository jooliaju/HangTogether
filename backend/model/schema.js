const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  partner: { type: String, required: false },
});

const gamesSchema = new Schema({
  partner1: { type: String, required: true },
  partner2: { type: String, required: true },
  dateStarted: { type: Date, required: true },
  activeStatus: { type: Boolean, required: true }, //this changes if someone removes the game
});

const Users = mongoose.model("Users", usersSchema, "users");
const Games = mongoose.model("Games", gamesSchema, "games");

const schemas = { Users: Users, Games: Games };

module.exports = schemas;
