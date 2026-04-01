const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,

    isVerified: { type: Boolean, default: false },

    otpHash: String,
    otpExpiry: Date,
    otpAttempts: { type: Number, default: 0 },
    resendAttempts: { type: Number, default: 0 },
    avatar: {
        url: String,
        public_id: String
    },
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema);