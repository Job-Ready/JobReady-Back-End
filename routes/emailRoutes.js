const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const nodemailer = require("nodemailer");

router.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;
  console.log(req);

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: "recipient@example.com",
    subject: `New Contact Form Submission from ${name}`,
    text: `Sender: ${name} <${email}>\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router; // This is important!
