/**
 * Mounted at /api — POST upload, GET list, GET by id
 */
const express = require("express");
const {
  upload,
  uploadDocument,
  listDocuments,
  getDocument,
} = require("../controllers/documentController");

const router = express.Router();

router.get("/documents", listDocuments);
router.get("/documents/:id", getDocument);

router.post("/documents/upload", (req, res, next) => {
  upload.single("document")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message || "File upload failed.",
      });
    }
    next();
  });
}, uploadDocument);

module.exports = router;
