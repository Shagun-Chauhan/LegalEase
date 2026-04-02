
const fs = require('fs');
const path = require('path');


function validateFile(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}


function getFileExtension(filename) {
  return path.extname(filename || '').toLowerCase();
}


function isSupportedFileType(filename) {
  const ext = getFileExtension(filename);
  const supportedExtensions = ['.pdf', '.docx', '.txt', '.text'];
  return supportedExtensions.includes(ext);
}


function cleanText(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/\r\n/g, '\n') 
    .replace(/\r/g, '\n') 
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ') 
    .replace(/^\s+|\s+$/g, '') 
    .trim();
}


function hasMinContent(text, minLength = 10) {
  const cleaned = cleanText(text);
  return cleaned.length >= minLength;
}


function estimateReadingTime(text) {
  if (!text) return 0;
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}


function generateSnippet(text, maxLength = 200) {
  if (!text) return '';
  const cleaned = cleanText(text);
  
  if (cleaned.length <= maxLength) return cleaned;
  
  return cleaned.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

module.exports = {
  validateFile,
  getFileExtension,
  isSupportedFileType,
  cleanText,
  hasMinContent,
  estimateReadingTime,
  generateSnippet
};