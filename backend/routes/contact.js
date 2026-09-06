const express = require("express");
const { sendContactEmail } = require("../mailer");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, message }) {
  const errors = {};

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.name = "Name is required.";
  } else if (name.trim().length > 100) {
    errors.name = "Name must be under 100 characters.";
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    errors.message = "Message is required.";
  } else if (message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (message.trim().length > 5000) {
    errors.message = "Message must be under 5000 characters.";
  }

  return errors;
}

router.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};

  const errors = validate({ name, email, message });
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Please fix the highlighted fields.",
      errors,
    });
  }

  try {
    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (err) {
    console.error("Failed to send contact email:", err.message);
    return res.status(502).json({
      success: false,
      message:
        "We couldn't send your message right now. Please try again in a moment.",
    });
  }
});

module.exports = router;
