
const express = require("express");
const {
  upload,
  uploadDocument,
  listDocuments,
  getDocument,
  deleteDocument,
  getDashboardStats,
} = require("../controllers/documentController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard/stats", auth, getDashboardStats);
router.get("/documents",auth, listDocuments);
router.get("/documents/:id",auth, getDocument);

router.post("/documents/upload", auth, (req, res, next) => {
  upload.single("document")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: err.message || "File upload failed.",
      });
    }
    next();
  });
}, uploadDocument);

router.delete("/documents/:id", auth, deleteDocument);
module.exports = router;
