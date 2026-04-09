
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractText(filePath, originalName) {
  const ext = path.extname(originalName || filePath).toLowerCase();

  if (ext === ".pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return (data.text || "").trim();
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return (result.value || "").trim();
  }

  if (ext === ".txt" || ext === ".text") {
    return fs.readFileSync(filePath, "utf8").trim();
  }

  throw new Error(
    "Unsupported file type. Please upload a PDF, DOCX, or TXT file."
  );
}

module.exports = { extractText };
