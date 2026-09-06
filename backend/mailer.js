const nodemailer = require("nodemailer");

// Single shared transporter, built once from env vars.
// Never log EMAIL_USER / EMAIL_PASS anywhere.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function verifyMailer() {
  try {
    await transporter.verify();
    console.log("Mailer ready: SMTP connection verified.");
  } catch (err) {
    console.error(
      "Mailer verification failed. Check EMAIL_USER/EMAIL_PASS in .env.",
      err.message
    );
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendContactEmail({ name, email, message }) {
  const receiver = process.env.RECEIVER_EMAIL;

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color:#151827;">New message from your site</h2>
      <p style="color:#4b4f5e;">You received a new contact form submission:</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
        <tr>
          <td style="padding:8px 0; color:#7c6ff0; font-weight:600; width:90px;">Name</td>
          <td style="padding:8px 0; color:#151827;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0; color:#7c6ff0; font-weight:600;">Email</td>
          <td style="padding:8px 0; color:#151827;">${escapeHtml(email)}</td>
        </tr>
      </table>
      <div style="margin-top:16px; padding:16px; background:#f4f4f8; border-radius:12px;">
        <p style="margin:0; white-space:pre-wrap; color:#151827;">${escapeHtml(
          message
        )}</p>
      </div>
    </div>
  `;

  const text = `New message from your site\n\nName: ${name}\nEmail: ${email}\n\n${message}`;

  return transporter.sendMail({
    from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
    to: receiver,
    replyTo: email,
    subject: `New contact form message from ${name}`,
    text,
    html,
  });
}

module.exports = { transporter, verifyMailer, sendContactEmail };
