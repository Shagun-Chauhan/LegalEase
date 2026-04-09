const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

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