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
    let finalText = docText;

    // 1. Translate if necessary
    if (language === "hindi" || language === "marathi") {
      const targetLang = language === "hindi" ? "hi" : "mr";
      const { text } = await translate(docText, { to: targetLang });
      finalText = text;
    }

    // 2. Build PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    // Check for font and use it to support Devanagari
    const fontPath = path.join(__dirname, "..", "NotoSansDevanagari-Regular.ttf");
    if (fs.existsSync(fontPath)) {
      doc.font(fontPath);
    }

    doc.fontSize(12).text(finalText, {
      align: 'left',
      lineGap: 4
    });

    const pdfBuffer = await new Promise((resolve, reject) => {
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      doc.end();
    });

    // 3. Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "legalease_documents",
          public_id: `Document_${Date.now()}.pdf`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(pdfBuffer);
    });
    
    const pdfUrl = uploadResult.secure_url;
    // 4. Save to MongoDB
    const newDoc = await GeneratedDocument.create({
      user: req.user.id,
      title: `${docType.replace('_', ' ').toUpperCase()} - ${new Date().toLocaleDateString()}`,
      docType,
      language,
      issueType: issueType || 'General',
      cloudinaryUrl: pdfUrl,
    });

    res.status(200).json({
      message: "Document generated and stored successfully.",
      document: newDoc,
    });

  } catch (error) {
    console.error("Finalize document error:", error);
    res.status(500).json({ message: "Failed to securely generate PDF." });
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
