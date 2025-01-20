const express = require("express");
const router = express.Router();
const generateToken = require("./helpers");
const { transporter, getEmailDetails } = require("./mailer");

// Send invitation
router.post("/invite", async (req, res) => {
  const { recipientEmail, senderId, wordToGuess } = req.body;

  const tokenData = {
    recipientEmail,
    whoSentInvite: senderId,
    wordForPartner2: wordToGuess,
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
