const { google } = require("googleapis");
require("dotenv").config();

// 🔐 OAuth2 setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

// Set refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// 📧 Send Email using Gmail API (NO SMTP)
const sendEmail = async (to, otp, emailType = "OTP") => {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    let subject, text;

    if (emailType === "SUCCESS") {
      subject = "Welcome to LegalEase!";
      text =
        "Your account has been successfully verified. Welcome to LegalEase dashboard. Start uploading documents and using the AI capabilities right away!";
    } else {
      subject = "LegalEase OTP Verification";
      text = `Your OTP is ${otp}. It is valid for 2 minutes.`;
    }

    // Construct email
    const message = [
      `From: LegalEase Vault <${process.env.EMAIL_USER}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "",
      text,
    ].join("\n");

    // Encode message
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    console.log(`Attempting to send ${emailType} email to: ${to}...`);

    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("✅ Email sent successfully:", res.data.id);

  } catch (error) {
    console.error("❌ Gmail API Error:", error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

module.exports = sendEmail;