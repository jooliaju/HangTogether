const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(tokenData) {
  const { recipientEmail, whoSentInvite, wordForPartner2 } = tokenData;

  console.log("whoSentInvite", whoSentInvite);
  const data = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // Token expires in 7 days
    recipientEmail: recipientEmail,
    wordForPartner2: wordForPartner2,
    senderId: whoSentInvite,
  };

  return jwt.sign(data, process.env.JWT_SECRET); // Sign with secret key
}
module.exports = generateToken;
