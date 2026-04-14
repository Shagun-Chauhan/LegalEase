process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const fs = require("fs");
const path = require("path");

dotenv.config();

const uploadsDir = path.join(__dirname, "uploads");
if (fs.existsSync(uploadsDir)) {
    fs.readdirSync(uploadsDir).forEach(file => {
        fs.unlinkSync(path.join(uploadsDir, file));
    });
}

dbConnect();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/location",require("./routes/locationRoutes"));
app.use("/api/document", require("./routes/documentRoutes"));
app.use("/api/generator", require("./routes/generatorRoutes"));
app.use("/api/ai/chat", require("./routes/chatRoutes"));

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
