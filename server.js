const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("🔥 FINAL SERVER RUNNING");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 📧 Email Setup (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail", // simpler than host/port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// ✅ Schema
const formSchema = new mongoose.Schema({
  fullName: String,
  address: String,
  email: String,
  issueType: String,
  description: String,
  date: String,
}, { timestamps: true });

const Form = mongoose.model("Form", formSchema);

// ================= SMART LEGAL NOTICE =================

const generateLegalNotice = (data) => {

  if (data.issueType === "Property Issue") {
    return `
LEGAL NOTICE

Date: ${data.date}

From:
${data.fullName}
${data.address}

To:
(Concerned Party)

Subject: Illegal Possession of Property

Sir/Madam,

Under instructions from my client ${data.fullName}, I hereby serve you this legal notice:

1. My client is the lawful owner of the property.
2. You are in illegal possession.
3. Despite multiple requests, you failed to vacate.

${data.description}

You are hereby required to vacate within 7 days.

Failing which, strict legal action will be taken.

Sincerely,
${data.fullName}
`;
  }

  if (data.issueType === "Salary Issue") {
    return `
LEGAL NOTICE

Subject: Non-Payment of Salary

I, ${data.fullName}, was employed but my salary is unpaid.

${data.description}

You must clear dues within 7 days.

Else legal action will be initiated.

${data.fullName}
`;
  }

  if (data.issueType === "Tenant Dispute") {
    return `
LEGAL NOTICE

Subject: Eviction Notice

You have violated rental agreement.

${data.description}

Vacate within 7 days or legal eviction will follow.

${data.fullName}
`;
  }

  if (data.issueType === "Consumer Complaint") {
    return `
LEGAL NOTICE

Subject: Defective Product / Service

${data.description}

Resolve within 7 days or complaint will be filed in Consumer Court.

${data.fullName}
`;
  }

  if (data.issueType === "Cybercrime") {
    return `
LEGAL NOTICE

Subject: Cyber Fraud

${data.description}

Failure to act will result in complaint to cyber authorities.

${data.fullName}
`;
  }

  return `
LEGAL NOTICE

Date: ${data.date}

From:
${data.fullName}

Subject: ${data.issueType}

${data.description}

Resolve within 7 days.

${data.fullName}
`;
};

// ================= ROUTES =================

// Test
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Save Form
app.post("/submit", async (req, res) => {
  try {
    const newForm = new Form(req.body);
    await newForm.save();
    res.json({ message: "✅ Saved Successfully", data: newForm });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Generate Text
app.get("/generate", async (req, res) => {
  const data = await Form.findOne().sort({ createdAt: -1 });
  if (!data) return res.send("No data found");

  const doc = generateLegalNotice(data);

  res.send(`<pre>${doc}</pre>`);
});

// ✅ Download PDF
app.get("/download", async (req, res) => {
  const data = await Form.findOne().sort({ createdAt: -1 });
  if (!data) return res.send("No data found");

  const content = generateLegalNotice(data);

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=legal_notice.pdf");

  doc.pipe(res);

  doc.fontSize(12).text(content);

  doc.end();
});

// ✅ Send Email
app.get("/send-email", async (req, res) => {
  try {
    const data = await Form.findOne().sort({ createdAt: -1 });
    if (!data) return res.send("No data found");

    const content = generateLegalNotice(data);

    const doc = new PDFDocument();
    const chunks = [];

    doc.on("data", chunk => chunks.push(chunk));

    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(chunks);

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: "Legal Notice",
        text: "Attached is your legal notice.",
        attachments: [
          {
            filename: "legal_notice.pdf",
            content: pdfBuffer,
          },
        ],
      });

      res.send("✅ Email sent successfully");
    });

    doc.fontSize(12).text(content);
    doc.end();

  } catch (err) {
    console.log(err);
    res.send("❌ Error sending email");
  }
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});