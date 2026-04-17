const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 resolution to prevent ENETUNREACH (IPv6) errors on Render/other hosting platforms
dns.setDefaultResultOrder("ipv4first");

const sendEmail = async (to, otp, emailType = "OTP") => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // false for 587 (uses STARTTLS)
      requireTLS: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, "") : "",
      },
      tls: {
        rejectUnauthorized: false // Fixes "self-signed certificate in certificate chain" on Render
      },
      connectionTimeout: 20000, // Increased to 20 seconds for slow Render cold starts
      greetingTimeout: 20000,
      socketTimeout: 20000,
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