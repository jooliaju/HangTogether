const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  partner: { type: String, required: false },
});

const Users = mongoose.model("Users", usersSchema, "users");

const schemas = { Users: Users };

module.exports = schemas;
