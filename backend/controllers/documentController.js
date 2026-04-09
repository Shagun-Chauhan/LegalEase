
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const Document = require("../models/Document");
const { extractText } = require("../services/documentParser");
const { analyzeLegalDocument } = require("../services/aiService");
const { cleanText, hasMinContent, validateFile } = require("../utils/textExtractor");

const uploadsDir = path.join(__dirname, "..", "uploads");


const crypto = require("crypto");

function generateFileHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}
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
    _id: d._id,
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
    riskScore: d.riskScore,
    dominantParty: d.dominantParty,
    redFlags: d.redFlags,
    simpleExplanation: d.simpleExplanation,
  };
}

async function uploadDocument(req, res) {
  console.log(`[${new Date().toISOString()}] Upload request received`);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const filePath = req.file.path;
  const originalFileName = req.file.originalname || "unknown";

  try {
    if (!validateFile(filePath)) {
      throw new Error("Uploaded file is not accessible");
    }

    const extractedText = await extractText(filePath, originalFileName);
    const cleanedText = cleanText(extractedText);

    if (!hasMinContent(cleanedText, 10)) {
      return res.status(400).json({
        error: "Not enough text extracted",
      });
    }

    // ✅ HASH
    const fileHash = generateFileHash(filePath);

    // ✅ CHECK DUPLICATE FOR SAME USER
    const existing = await Document.findOne({
      fileHash,
      user: req.user.id,
    });

    if (existing) {
      return res.json({
        success: true,
        message: "Already analyzed",
        ...serializeDoc(existing),
      });
    }

    // ✅ AI CALL
    const ai = await analyzeLegalDocument(cleanedText);

    // ✅ SAVE WITH USER
    const doc = await Document.create({
      user: req.user.id,
      fileHash,
      originalFileName,

      documentSummary: ai.documentSummary,
      keyPoints: Array.isArray(ai.keyPoints)
        ? ai.keyPoints
        : [ai.keyPoints],

      legalProcessType: ai.legalProcessType,
      estimatedTime: ai.estimatedTime,
      estimatedCost: ai.estimatedCost,
      successProbability: ai.successProbability,
      riskAnalysis: ai.riskAnalysis,
      riskLevel: ai.riskLevel,
      riskScore: ai.riskScore,
      dominantParty: ai.dominantParty,
      redFlags: ai.redFlags,
      simpleExplanation: ai.simpleExplanation,
    });

    return res.status(201).json({
      success: true,
      ...serializeDoc(doc),
    });

  } catch (err) {
    console.error("uploadDocument error:", err.message);

    return res.status(500).json({
      error: err.message || "Processing failed",
    });

  } finally {
    try {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error("Cleanup error in documentController:", cleanupError.message);
    }
  }
}

async function listDocuments(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const rows = await Document.find({ user: req.user.id })
      .sort({ uploadedAt: -1 })
      .limit(50)
      .lean();

    const documents = rows.map((d) => serializeDoc(d));

    return res.json({ documents });

  } catch (err) {
    console.error("listDocuments error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
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
async function deleteDocument(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid document id." });
  }

  try {
    const doc = await Document.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ success: true, message: "Deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getDashboardStats(req, res) {
  try {
    const docs = await Document.find({ user: req.user.id })
      .sort({ uploadedAt: -1 })
      .lean();

    const totalDocuments = docs.length;
    const highRiskCount = docs.filter(d => d.riskLevel === "High").length;

    let totalRiskScore = 0;
    docs.forEach(d => {
      totalRiskScore += (d.riskScore || 0);
    });
    const avgRiskScore = totalDocuments > 0 ? (totalRiskScore / totalDocuments).toFixed(1) : 0;

    // Recent activity (last 5)
    const recentActivity = docs.slice(0, 5).map(doc => ({
      id: doc._id,
      title: doc.originalFileName,
      type: "Document",
      status: "completed", // Since it's in DB, it's processed
      time: doc.uploadedAt,
      riskLevel: doc.riskLevel
    }));

    res.json({
      totalDocuments,
      highRiskCount,
      avgRiskScore,
      recentActivity
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  upload,
  uploadDocument,
  listDocuments,
  getDocument,
  deleteDocument,
  getDashboardStats,
};
