/**
 * Multer upload → parse text → Gemini → save Document → JSON.
 * Plus list / get-by-id for the results UI.
 */
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const Document = require("../models/Document");
const { extractText } = require("../services/documentParser");
const { analyzeLegalDocument } = require("../services/aiService");
const { cleanText, hasMinContent, validateFile } = require("../utils/textExtractor");

const uploadsDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname || "") || "";
    cb(null, unique + ext);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const allowedExt = [".pdf", ".docx", ".txt", ".text"];
  const allowedMime = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  if (allowedExt.includes(ext) || allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, and TXT files are allowed."));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
});

function serializeDoc(doc) {
  const d = doc.toObject ? doc.toObject() : doc;
  return {
    id: d._id,
    originalFileName: d.originalFileName,
    uploadedAt: d.uploadedAt,
    documentSummary: d.documentSummary,
    keyPoints: d.keyPoints,
    legalProcessType: d.legalProcessType,
    estimatedTime: d.estimatedTime,
    estimatedCost: d.estimatedCost,
    successProbability: d.successProbability,
    riskAnalysis: d.riskAnalysis,
    riskLevel: d.riskLevel,
  };
}

async function uploadDocument(req, res) {
  console.log(`[${new Date().toISOString()}] Upload request received`);
  
  if (!req.file) {
    console.error('No file uploaded in request');
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filePath = req.file.path;
  const originalFileName = req.file.originalname || "unknown";

  console.log(`Processing file: ${originalFileName}, path: ${filePath}`);

  try {
    // Validate file exists
    if (!validateFile(filePath)) {
      throw new Error("Uploaded file is not accessible");
    }

    console.log('Extracting text from document...');
    const extractedText = await extractText(filePath, originalFileName);
    const cleanedText = cleanText(extractedText);

    console.log(`Extracted ${cleanedText.length} characters of text`);

    if (!hasMinContent(cleanedText, 10)) {
      console.warn('Insufficient text extracted from document');
      return res.status(400).json({
        error:
          "Could not extract enough text from the file. Try another PDF, DOCX, or TXT.",
      });
    }

    console.log('Analyzing document with AI...');
    const ai = await analyzeLegalDocument(cleanedText);
    
    console.log('AI analysis completed, saving to database...');
    const doc = await Document.create({
      originalFileName,
      documentSummary: ai.documentSummary,
      keyPoints: ai.keyPoints,
      legalProcessType: ai.legalProcessType,
      estimatedTime: ai.estimatedTime,
      estimatedCost: ai.estimatedCost,
      successProbability: ai.successProbability,
      riskAnalysis: ai.riskAnalysis,
      riskLevel: ai.riskLevel,
    });

    console.log(`Document saved with ID: ${doc._id}`);
    return res.status(201).json({
      success: true,
      ...serializeDoc(doc),
    });
  } catch (err) {
    console.error("uploadDocument error:", {
      message: err.message,
      stack: err.stack,
      fileName: originalFileName
    });
    
    const msg = err?.message ? String(err.message) : String(err);
    const isAiFailure =
      msg.includes("AI") ||
      msg.includes("GEMINI") ||
      msg.includes("model call failed") ||
      msg.includes("parseModelJson");

    return res.status(isAiFailure ? 502 : 500).json({
      error: msg || "Processing failed. Check server logs and .env.",
    });
  } finally {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up temporary file: ${filePath}`);
      }
    } catch (unlinkErr) {
      console.warn("Could not delete temp file:", unlinkErr.message);
    }
  }
}

/** GET /api/documents — recent analyses for optional dashboard use */
async function listDocuments(req, res) {
  console.log(`[${new Date().toISOString()}] List documents request received`);
  
  try {
    const rows = await Document.find()
      .sort({ uploadedAt: -1 })
      .limit(50)
      .lean();

    console.log(`Found ${rows.length} documents in database`);

    const documents = rows.map((d) => ({
      id: d._id,
      originalFileName: d.originalFileName,
      uploadedAt: d.uploadedAt,
      legalProcessType: d.legalProcessType,
      riskLevel: d.riskLevel,
    }));

    return res.json({ documents });
  } catch (err) {
    console.error("listDocuments error:", {
      message: err.message,
      stack: err.stack
    });
    return res.status(500).json({ error: err.message });
  }
}

/** GET /api/documents/:id — single record for results.html */
async function getDocument(req, res) {
  const { id } = req.params;
  console.log(`[${new Date().toISOString()}] Get document request for ID: ${id}`);
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.warn(`Invalid document ID requested: ${id}`);
    return res.status(400).json({ error: "Invalid document id." });
  }

  try {
    const doc = await Document.findById(id);
    if (!doc) {
      console.warn(`Document not found: ${id}`);
      return res.status(404).json({ error: "Document not found." });
    }
    
    console.log(`Document found: ${doc.originalFileName}`);
    return res.json(serializeDoc(doc));
  } catch (err) {
    console.error("getDocument error:", {
      message: err.message,
      stack: err.stack,
      documentId: id
    });
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  upload,
  uploadDocument,
  listDocuments,
  getDocument,
};
