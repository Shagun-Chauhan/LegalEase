const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const fs = require("fs");
const path = require("path");

dotenv.config();

// Startup Purge: Clear any orphaned uploads
const uploadsDir = path.join(__dirname, "uploads");
if (fs.existsSync(uploadsDir)) {
    fs.readdirSync(uploadsDir).forEach(file => {
        fs.unlinkSync(path.join(uploadsDir, file));
    });
}

dbConnect();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/location",require("./routes/locationRoutes"));
app.use("/api/document", require("./routes/documentRoutes"));
app.use("/api/generator", require("./routes/generatorRoutes"));

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});