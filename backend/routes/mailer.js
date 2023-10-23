const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TEST_EMAIL,
    pass: process.env.TEST_PASS,
  },
});

function getEmailDetails(email, token) {
  const invitationLink = "http://localhost:5173/invitation?token=" + token;

  const mailOptions = {
    from: process.env.TEST_EMAIL,
    to: email,
    subject: "Invitation to join Hangman Game!",
    text: `Click this link to join the game: ${invitationLink}`,
  };

  return mailOptions;
}

module.exports = { transporter, getEmailDetails };
