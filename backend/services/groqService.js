const axios = require("axios");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";


const getGroqResponse = async (messages) => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 300,
        top_p: 1,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, 
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("Empty response received from Groq API.");
    }

    return reply.trim();
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const errMsg = error.response.data?.error?.message || "Unknown API error";
      console.error(`❌ Groq API error [${status}]: ${errMsg}`);
      throw new Error(`Groq API error (${status}): ${errMsg}`);
    } else if (error.code === "ECONNABORTED") {
      console.error("❌ Groq API request timed out.");
      throw new Error("Groq API request timed out. Please try again.");
    } else {
      console.error(`❌ Groq service error: ${error.message}`);
      throw error;
    }
  }
};

module.exports = { getGroqResponse };