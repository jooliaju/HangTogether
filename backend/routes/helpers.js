const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(tokenData) {
  const { recipientEmail, whoSentInvite, wordForPartner2 } = tokenData;

  console.log("whoSentInvite", whoSentInvite);
  const data = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // Expires in 1 week?
    recipientEmail: recipientEmail,
    wordForPartner2: wordForPartner2,
    senderId: whoSentInvite, //userId
  };

  return jwt.sign(data, process.env.JWT_SECRET);
}
module.exports = generateToken;
