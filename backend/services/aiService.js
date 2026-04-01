const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const MAX_CHARS = 35000; // Keep this to stay within free tier token limits

const schema = {
  description: "Legal Document Analysis",
  type: SchemaType.OBJECT,
  properties: {
    documentSummary: { type: SchemaType.STRING },
    keyPoints: { type: SchemaType.STRING },
    legalProcessType: { type: SchemaType.STRING },
    estimatedTime: { type: SchemaType.STRING },
    estimatedCost: { type: SchemaType.STRING },
    successProbability: { type: SchemaType.STRING },
    riskAnalysis: { type: SchemaType.STRING },
    riskLevel: { type: SchemaType.STRING, enum: ["Low", "Medium", "High"] },
  },
  required: ["documentSummary", "riskLevel", "keyPoints"],
};

async function analyzeLegalDocument(documentText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  // Trim the text to ensure we don't exceed model context limits
  const trimmedText = documentText.length > MAX_CHARS 
    ? documentText.slice(0, MAX_CHARS) 
    : documentText;

  const prompt = `Analyze the following legal document text and provide a structured analysis: ${trimmedText}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    if (err.message.includes("429")) {
      throw new Error("API Quota exceeded. Please wait a moment or check your Google AI Studio billing.");
    }
    throw new Error("Failed to analyze document. Please try again later.");
  }
}

module.exports = { analyzeLegalDocument };