const GeneratedDocument = require("../models/GeneratedDocument");
const { generateDraft } = require("../utils/legalTemplates");
const translate = require("google-translate-api-x");
const PDFDocument = require("pdfkit");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getDraft = async (req, res) => {
  try {
    const { docType, form } = req.body;
    if (!docType || !form) {
      return res.status(400).json({ message: "Missing document type or form data" });
    }
    const draftText = generateDraft(docType, form);
    res.status(200).json({ text: draftText });
  } catch (error) {
    console.error("Draft generation error:", error);
    res.status(500).json({ message: "Failed to generate draft." });
  }
};
exports.finalizeDocument = async (req, res) => {
  try {
    const { docText, language, docType, issueType } = req.body;
    if (!docText || !language || !docType) {
      return res.status(400).json({ message: "Missing required document data" });
    }

    let finalText = docText.replace(/\\n/g, "\n");

    const fontPath = path.join(__dirname, "..", "NotoSansDevanagari-Regular.ttf");

    // ✅ TRANSLATION FIX
    if (language === "hindi" || language === "marathi") {
      const targetLang = language === "hindi" ? "hi" : "mr";

      try {
        const result = await translate(finalText, { to: targetLang });
        finalText = result.text;
      } catch (err) {
        console.error("Translation failed:", err);
      }
    }

    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", chunk => chunks.push(chunk));

    const pdfBufferPromise = new Promise((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });

    // ✅ FONT FIX
    if ((language === "hindi" || language === "marathi") && fs.existsSync(fontPath)) {
      doc.registerFont("devanagari", fontPath);
      doc.font("devanagari");
    } else {
      doc.font("Helvetica");
    }

    doc.fontSize(12).text(finalText, {
      align: "left",
      lineGap: 4,
    });

    doc.end();

    const pdfBuffer = await pdfBufferPromise;
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", 
          folder: "legalease_documents",
          public_id: `Document_${Date.now()}.pdf`,
          access_mode: "public",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(pdfBuffer);
    });

    const pdfUrl = uploadResult.secure_url;

    // ✅ BETTER TITLE
    const newDoc = await GeneratedDocument.create({
      user: req.user.id,
      title: `${docType.replace('_', ' ').toUpperCase()} - ${issueType || 'GENERAL'} - ${new Date().toLocaleDateString()}`,
      docType,
      language,
      issueType: issueType || 'General',
      cloudinaryUrl: pdfUrl,
    });

    res.status(200).json({
      message: "Document generated successfully",
      document: newDoc,
    });

  } catch (error) {
    console.error("Finalize document error:", error);
    res.status(500).json({ message: "Failed to generate PDF." });
  }
};
exports.getUserDocuments = async (req, res) => {
  try {
    const docs = await GeneratedDocument.find({ user: req.user.id }).sort({ generatedAt: -1 });
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch documents." });
  }
};
