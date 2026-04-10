const Groq = require("groq-sdk");

async function analyzeWithGroq(documentText, schemaProperties) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const groq = new Groq({ apiKey });

  const prompt = `
    You are an expert legal assistant AI.
    
    Analyze the following legal document and return ONLY valid JSON matching this structure:
    ${JSON.stringify(schemaProperties, null, 2)}
    
    Instructions:
    - Use simple, clear language.
    - keyPoints and redFlags MUST be arrays of short strings.
    - riskScore MUST be a number between 1-10.
    - return valid JSON only.
    
    DOCUMENT:
    ${documentText}
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    return JSON.parse(content);

  } catch (err) {
    console.error("Groq Analysis Error:", err.message);
    throw new Error(`Groq API Error: ${err.message}`);
  }
}

async function getGroqResponse(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const groq = new Groq({ apiKey });

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

  } catch (err) {
    console.error("Groq Chat Error:", err.message);
    throw new Error(`Groq API Error: ${err.message}`);
  }
}

module.exports = { analyzeWithGroq, getGroqResponse };