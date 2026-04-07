const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chatController");

// POST /api/ai/chat — Send a message and get an AI response
router.post("/", handleChat);

module.exports = router;
