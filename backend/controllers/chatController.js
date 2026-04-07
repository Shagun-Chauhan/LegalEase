const { getGroqResponse } = require("../services/groqService");
const { formatMessages } = require("../utils/formatMessages");

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required." });
    }

    const trimmedMessage = message.trim();

    const formattedMessages = formatMessages(trimmedMessage);

    const aiReply = await getGroqResponse(formattedMessages);

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