/**
 * File upload middleware for LegalEase
 * Handles validation and processing of uploaded documents
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname || '') || '';
    cb(null, unique + ext);
  }
});

// File filter
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const allowedExt = ['.pdf', '.docx', '.txt', '.text'];
  const allowedMime = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedExt.includes(ext) || allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOCX, and TXT files are allowed.'));
  }
}

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 15 * 1024 * 1024, // 15MB limit
    files: 1 // Only one file at a time
  }
});

module.exports = { upload, fileFilter };