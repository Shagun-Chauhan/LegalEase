/**
 * LegalEase API — Express + MongoDB Atlas + Static Frontend
 */

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const documentRoutes = require("./routes/documentRoutes");

const app = express();

/* ---------------- MIDDLEWARE ---------------- */

app.use(cors());
app.use(express.json());

/* ---------------- MONGOOSE CONFIG ---------------- */

mongoose.set("bufferCommands", false);

const mongoUri = process.env.MONGODB_URI
  ? String(process.env.MONGODB_URI).trim()
  : "";

if (!mongoUri) {
  console.error(
    "FATAL ERROR: MONGODB_URI not found in .env file. Please add your MongoDB Atlas connection string."
  );
  process.exit(1);
}

const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

/* ---------------- MONGODB EVENTS ---------------- */

mongoose.connection.on("connected", () => {
  console.log("MongoDB Atlas connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting reconnection...");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

/* ---------------- ROUTES ---------------- */

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "LegalEase API is running",
    endpoints: {
      health: "GET /",
      upload: "POST /api/documents/upload (multipart field: document)",
      list: "GET /api/documents",
      one: "GET /api/documents/:id",
    },
  });
});

app.use("/api", documentRoutes);

/* ---------------- STATIC FRONTEND ---------------- */

app.use(express.static(path.join(__dirname, "..", "frontend")));

/* ---------------- SERVER CONFIG ---------------- */

const PORT = Number(process.env.PORT) || 5000;

/* ---------------- START SERVER AFTER DB CONNECT ---------------- */

async function connectDB() {
  try {
    await mongoose.connect(mongoUri, mongooseOptions);

    console.log("MongoDB Atlas connected");

    startServer();
  } catch (error) {
    console.error(
      "MongoDB initial connection failed. Retrying in 5 seconds:",
      error.message
    );

    setTimeout(connectDB, 5000);
  }
}

/* ---------------- START EXPRESS SERVER ---------------- */

function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Upload: http://localhost:${PORT}/upload.html`);
    console.log(`Results: http://localhost:${PORT}/results.html?id=<documentId>`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${PORT} in use. Trying next port...`);
      app.listen(PORT + 1);
    } else {
      console.error("Server startup error:", err);
    }
  });
}

/* ---------------- GRACEFUL SHUTDOWN ---------------- */

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB:", err);
    process.exit(1);
  }
});

/* ---------------- START APPLICATION ---------------- */

connectDB();