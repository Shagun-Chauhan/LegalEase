const { getGroqResponse } = require("../services/groqService");
const { formatMessages } = require("../utils/formatMessages");

/**
 * POST /api/ai/chat
 * Stateless chat: sends user message to AI and returns the response.
 * No database storage, no session tracking.
 */
const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    // ── Validate input ──────────────────────────────────────────────
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required." });
    }

    const trimmedMessage = message.trim();

    console.log(`💬 User: ${trimmedMessage.substring(0, 80)}...`);

    // ── Format messages for Groq (system prompt + user message) ────
    const formattedMessages = formatMessages(trimmedMessage);

    // ── Get AI response ─────────────────────────────────────────────
    const aiReply = await getGroqResponse(formattedMessages);

    console.log(`🤖 Assistant: ${aiReply.substring(0, 80)}...`);

    // ── Respond to client ───────────────────────────────────────────
    return res.status(200).json({
      data: {
        reply: aiReply,
      },
    });
  } catch (error) {
    console.error(`❌ Chat controller error: ${error.message}`);
    console.error(error.stack);
    return res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = { handleChat };
