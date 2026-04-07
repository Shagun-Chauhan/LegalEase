const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getDraft, finalizeDocument, getUserDocuments } = require("../controllers/generatorController");

router.post("/draft", protect, getDraft);
router.post("/finalize", protect, finalizeDocument);
router.get("/my-documents", protect, getUserDocuments);

module.exports = router;
