/**
 * Text extraction utilities for LegalEase
 * Helper functions for document processing and validation
 */

const fs = require('fs');
const path = require('path');

/**
 * Validates if a file exists and is readable
 * @param {string} filePath - Path to the file
 * @returns {boolean} - True if file is valid
 */
function validateFile(filePath) {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}

/**
 * Gets file extension from filename or path
 * @param {string} filename - File name or path
 * @returns {string} - File extension (lowercase, with dot)
 */
function getFileExtension(filename) {
  return path.extname(filename || '').toLowerCase();
}

/**
 * Validates file type based on extension
 * @param {string} filename - File name or path
 * @returns {boolean} - True if file type is supported
 */
function isSupportedFileType(filename) {
  const ext = getFileExtension(filename);
  const supportedExtensions = ['.pdf', '.docx', '.txt', '.text'];
  return supportedExtensions.includes(ext);
}

/**
 * Cleans and normalizes extracted text
 * @param {string} text - Raw extracted text
 * @returns {string} - Cleaned text
 */
function cleanText(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n') // Handle old Mac line endings
    .replace(/\n{3,}/g, '\n\n') // Reduce multiple consecutive newlines
    .replace(/[ \t]+/g, ' ') // Normalize spaces
    .replace(/^\s+|\s+$/g, '') // Trim leading/trailing whitespace
    .trim();
}

/**
 * Validates if extracted text has minimum content
 * @param {string} text - Extracted text
 * @param {number} minLength - Minimum required length (default: 10)
 * @returns {boolean} - True if text has sufficient content
 */
function hasMinContent(text, minLength = 10) {
  const cleaned = cleanText(text);
  return cleaned.length >= minLength;
}

/**
 * Estimates reading time for text
 * @param {string} text - Text to analyze
 * @returns {number} - Estimated reading time in minutes
 */
function estimateReadingTime(text) {
  if (!text) return 0;
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Generates a summary snippet from text
 * @param {string} text - Source text
 * @param {number} maxLength - Maximum length of snippet (default: 200)
 * @returns {string} - Text snippet
 */
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