const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const MAX_CHARS = 35000; 

const schema = {
  description: "Legal Document Analysis",
  type: SchemaType.OBJECT,
  properties: {
    documentSummary: { type: SchemaType.STRING },

    keyPoints: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },

    legalProcessType: { type: SchemaType.STRING },
    estimatedTime: { type: SchemaType.STRING },
    estimatedCost: { type: SchemaType.STRING },

    successProbability: { type: SchemaType.STRING },

    riskAnalysis: { type: SchemaType.STRING },

    riskLevel: {
      type: SchemaType.STRING,
      enum: ["Low", "Medium", "High"],
    },

    riskScore: { type: SchemaType.NUMBER },

    dominantParty: { type: SchemaType.STRING },

    redFlags: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },

    simpleExplanation: { type: SchemaType.STRING },
  },

  required: [
    "documentSummary",
    "keyPoints",
    "riskLevel",
    "riskScore",
  ],
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

  const trimmedText = documentText.length > MAX_CHARS 
    ? documentText.slice(0, MAX_CHARS) 
    : documentText;

    const prompt = `
    You are an expert legal assistant AI.
    
    Analyze the following legal document and return ONLY valid JSON.
    
    Instructions:
    - Use simple, clear language
    - Do NOT return paragraphs where lists are needed
    - keyPoints MUST be short bullet points
    - redFlags MUST highlight risky clauses
    - simpleExplanation should be very easy to understand (like explaining to a beginner)
    
    Return in this format:
    
    {
      "documentSummary": "...",
    
      "keyPoints": [
        "point 1",
        "point 2"
      ],
    
      "legalProcessType": "...",
      "estimatedTime": "...",
      "estimatedCost": "...",
    
      "successProbability": "High/Medium/Low with reason",
    
      "riskAnalysis": "...",
    
      "riskLevel": "Low/Medium/High",
    
      "riskScore": number between 1-10,
    
      "dominantParty": "Client / Service Provider / Neutral",
    
      "redFlags": [
        "Risk 1",
        "Risk 2"
      ],
    
      "simpleExplanation": "Explain this in very simple terms"
    }
    
    DOCUMENT:
    ${trimmedText}
    `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        console.error("Raw AI response:", text);
        throw new Error("Invalid AI JSON format");
      }

      return parsed;
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    if (err.message.includes("429")) {
      throw new Error("API Quota exceeded. Please wait a moment or check your Google AI Studio billing.");
    }
    throw new Error("Failed to analyze document. Please try again later.");
  }
}

module.exports = { analyzeLegalDocument };