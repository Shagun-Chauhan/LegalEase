const nodemailer = require("nodemailer");

const sendEmail = async (to, otp, emailType = "OTP") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let subject, text;
    if (emailType === "SUCCESS") {
      subject = "Welcome to LegalEase!";
      text = "Your account has been successfully verified. Welcome to LegalEase dashboard. Start uploading documents and using the AI capabilities right away!";
    } else {
      subject = "LegalEase OTP Verification";
      text = `Your OTP is ${otp}. It is valid for 2 minutes.`;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");

  } catch (error) {
    console.log("Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;