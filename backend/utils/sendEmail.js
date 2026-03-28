const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: "LegalEase OTP Verification",
      text: `Your OTP is ${otp}. It is valid for 2 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");

  } catch (error) {
    console.log("Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;