require("dotenv").config();
const nodemailer = require("nodemailer");

// Getting Nodemailer all setup with the credentials
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com", // "outlook.office365.com"
  port: 587,
  secure: false,
  dnsTimeout: 60000,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

module.exports = async (username, email) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Confirmation Email ✔",
    html: `
    <a href='${process.env.CLIENT_ORIGIN}/confirming_email/${email}/${username}'>
    click to confirm email
    </a>
    `,
  };

  await transporter.sendMail(mailOptions)
};
