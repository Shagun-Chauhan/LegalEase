const mongoose = require("mongoose");

const generatedDocumentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  docType: {
    type: String, // legal_notice, complaint, etc.
    required: true,
  },
  language: {
    type: String, // english, hindi, marathi
    required: true,
  },
  issueType: {
    type: String,
  },
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GeneratedDocument", generatedDocumentSchema);
