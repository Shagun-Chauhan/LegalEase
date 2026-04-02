const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  register,
  verifyOtp,
  resendOtp,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require("../controllers/authController");

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  updateProfile
);
router.put("/change-password", authMiddleware, changePassword);
router.post("/logout", authMiddleware, logout);

module.exports = router;