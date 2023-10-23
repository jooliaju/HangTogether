const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(tokenData) {
  const { recipientEmail, whoSentInvite, gameId } = tokenData;

  console.log("whoSentInvite", whoSentInvite);
  const data = {
    // You can add more data here if needed
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
    recipientEmail: recipientEmail,
    senderId: whoSentInvite, //userId
    sessionId: gameId,
  };

  return jwt.sign(data, process.env.JWT_SECRET);
}
module.exports = generateToken;
