require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const chatRoutes = require("./routes/chatRoutes");

// ── Initialize Express ──────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────────────
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// ── Routes ──────────────────────────────────────────────────────────
app.use("/api/ai/chat", chatRoutes);

// ── Health check ────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 handler ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ── Global error handler ────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(`🔥 Unhandled error: ${err.message}`);
  res.status(500).json({ error: "Internal server error." });
});

// ── Start server ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Chat API: POST http://localhost:${PORT}/api/ai/chat`);
  console.log(`❤️  Health:   GET  http://localhost:${PORT}/api/health`);
});
