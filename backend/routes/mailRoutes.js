const express = require("express");
const router = express.Router();
const generateToken = require("./helpers");
const { transporter, getEmailDetails } = require("./mailer");
const rateLimit = require("express-rate-limit");

// Add rate limiting
const inviteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

// Send invitation
router.post("/new", inviteLimiter, async (req, res) => {
  const { recipientEmail, senderId, wordToGuess } = req.body;

  // Package the invitation data
  const tokenData = {
    recipientEmail, // Email of person being invited
    whoSentInvite: senderId, // Firebase UID of inviter
    wordForPartner2: wordToGuess, // Word that invitee needs to guess
  };
  const token = generateToken(tokenData); // Create JWT

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
