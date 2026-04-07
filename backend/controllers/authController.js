const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { generateOTP } = require("../utils/generateOTP");
const cloudinary = require("cloudinary");

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    try {
      await sendEmail(email, null, "SUCCESS");
    } catch (err) {
      console.log("Failed to send success email:", err.message);
    }

    res.json({ user, message: "User verified successfully" });
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // development
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      ...user._doc,
      avatar: user.avatar?.url
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;

    if (req.file) {
      try {
        if (user.avatar?.public_id) {
          await cloudinary.uploader.destroy(user.avatar.public_id);
        }
      } catch (err) {
        console.log("❌ Delete error:", err.message);
      }

      user.avatar = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar?.url
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};
