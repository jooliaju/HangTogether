const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String },
});

const Users = mongoose.model("Users", usersSchema, "users");

const schemas = { Users: Users };

module.exports = schemas;
