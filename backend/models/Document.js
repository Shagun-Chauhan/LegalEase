/**
 * MongoDB schema: one record per analyzed upload (MongoDB Atlas).
 */
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  originalFileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  /** Plain-language summary of the document */
  documentSummary: { type: String, default: "" },
  /** Bullet list of key points (newline-separated string) */
  keyPoints: { type: String, default: "" },
  /** Predicted legal process / matter type */
  legalProcessType: { type: String, default: "" },
  estimatedTime: { type: String, default: "" },
  estimatedCost: { type: String, default: "" },
  successProbability: { type: String, default: "" },
  /** Explanation of main risks in simple language */
  riskAnalysis: { type: String, default: "" },
  /** One of: Low / Medium / High */
  riskLevel: { type: String, default: "" },
});

module.exports = mongoose.model("Document", documentSchema);
