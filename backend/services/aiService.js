const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const { analyzeWithGroq } = require("./groqService");

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

  const trimmedText = documentText.length > MAX_CHARS 
    ? documentText.slice(0, MAX_CHARS) 
    : documentText;

  // FALLBACK CHAIN
  const configs = [
    { model: "gemini-1.5-flash", version: "v1beta", useSchema: true },
    { model: "gemini-1.5-flash", version: "v1", useSchema: false },
    { model: "gemini-pro", version: "v1", useSchema: false }, // Legacy 1.0 Pro
    { model: "gemini-1.5-pro", version: "v1beta", useSchema: true },
    { model: "gemini-2.0-flash-exp", version: "v1beta", useSchema: true },
  ];

  let lastError = null;

  for (const config of configs) {
    try {
      console.log(`[AI] Attempting ${config.model} (${config.version}, schema: ${config.useSchema})...`);
      
      const genAI = new GoogleGenerativeAI(apiKey, { apiVersion: config.version });
      
      let model;
      let result;

      if (config.useSchema) {
        model = genAI.getGenerativeModel({
          model: config.model,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
          },
        });
        
        const prompt = `Analyze this legal document and return valid JSON matching the schema.\n\nDOCUMENT:\n${trimmedText}`;
        result = await model.generateContent(prompt);
      } else {
        model = genAI.getGenerativeModel({ model: config.model });
        
        const prompt = `
          Analyze this legal document and return ONLY valid JSON.
          Schema structure: ${JSON.stringify(schema.properties)}
          
          DOCUMENT:
          ${trimmedText}
        `;
        result = await model.generateContent(prompt);
      }

      const text = result.response.text();
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      
      console.log(`[AI] SUCCESS with ${config.model} (${config.version})`);
      return parsed;

    } catch (err) {
      console.warn(`[AI] ${config.model} (${config.version}) failed:`, err.message);
      lastError = err;
      continue;
    }
  }

  // ULTIMATE FALLBACK: GROQ
  try {
    console.log("[AI] Attempting Ultimate Fallback: Groq (Llama-3.3)");
    return await analyzeWithGroq(trimmedText, schema.properties);
  } catch (groqErr) {
    console.error("[AI] Groq fallback also failed:", groqErr.message);
    throw new Error(`AI API failed all fallbacks (Gemini & Groq). Last error: ${groqErr.message}`);
  }
}

async function callGemini(model, documentText) {
  const trimmedText = documentText.length > MAX_CHARS 
    ? documentText.slice(0, MAX_CHARS) 
    : documentText;

  const prompt = `
    Analyze the following legal document and return valid JSON matching the provided schema.
    
    DOCUMENT:
    ${trimmedText}
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Raw AI response failed to parse:", text);
    throw new Error("Invalid AI JSON format");
  }
}

module.exports = { analyzeLegalDocument };