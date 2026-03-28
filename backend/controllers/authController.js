const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { generateOTP } = require("../utils/generateOTP");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    if (!user) {
      user = new User({ name, email, password: hashedPassword });
    } else {
      user.password = hashedPassword;
    }

    user.otpHash = otpHash;
    user.otpExpiry = Date.now() + 2 * 60 * 1000; 
    user.otpAttempts = 0;
    user.resendAttempts = 0;

    await user.save();

    await sendEmail(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otpAttempts >= 3) {
      if (Date.now() > user.otpExpiry) {
        user.otpAttempts = 0;
        await user.save();
      } else {
        return res.status(429).json({
          message: "Too many attempts. Try again after OTP expires (2 min) or request new OTP."
        });
      }
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired. Please request a new OTP."
      });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);

    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        message: `Invalid OTP. Attempts left: ${5 - user.otpAttempts}`
      });
    }

    user.isVerified = true;
    user.otpHash = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
    user.resendAttempts = 0;

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, message: "User verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resendAttempts >= 3) {
      return res.status(429).json({
        message: "Too many resend attempts. Try later."
      });
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    user.otpHash = otpHash;
    user.otpExpiry = Date.now() + 2 * 60 * 1000;
    user.resendAttempts += 1;
    user.otpAttempts = 0; 

    await user.save();

    await sendEmail(email, otp);

    res.json({ message: "OTP resent successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email first"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};