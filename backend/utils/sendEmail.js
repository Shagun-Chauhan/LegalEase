const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 resolution to prevent ENETUNREACH (IPv6) errors on Render/other hosting platforms
dns.setDefaultResultOrder("ipv4first");

const sendEmail = async (to, otp, emailType = "OTP") => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, "") : "",
      },
      tls: {
        rejectUnauthorized: false // Fixes "self-signed certificate in certificate chain" on Render
      },
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
      socketTimeout: 10000,
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
      from: `"LegalEase Vault" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    console.log(`Attempting to send ${emailType} email to: ${to}...`);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");

  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

module.exports = sendEmail;