# LegalEase

Professional **AI-powered legal document analyzer**: upload PDF/DOCX/TXT → extract text → **Google Gemini** analysis → store in **MongoDB Atlas** → view in a **table-based** UI.

---

## Project structure

```
LegalEase/
├── backend/
│   ├── controllers/documentController.js   # Upload, list, get-by-id
│   ├── models/Document.js                  # Mongoose schema
│   ├── routes/documentRoutes.js            # Mounted at /api
│   ├── services/
│   │   ├── aiService.js                    # Gemini prompts + JSON parse
│   │   └── documentParser.js               # PDF / DOCX / TXT extraction
│   ├── uploads/                            # Temp files (deleted after parse)
│   ├── server.js
│   ├── package.json
│   ├── .env                                # YOU create this (secrets)
│   └── .env-example                        # Template only
│
├── frontend/
│   ├── index.html
│   ├── upload.html
│   ├── results.html
│   ├── styles.css
│   ├── app.js
│   └── assets/logo.png
│
└── README.md
```

---

## Where to put credentials (only one place)

**All secrets go in `backend/.env`** (copy from `backend/.env-example`).

| Variable | What to put |
|----------|-------------|
| `GEMINI_API_KEY` | API key from [Google AI Studio](https://aistudio.google.com/apikey). **Not** pasted in any `.js` file. |
| `MONGODB_URI` | Full **MongoDB Atlas** connection string. Username/password are **inside this URI** (Atlas “Connect → Drivers”). **Not** split across multiple files. |
| `PORT` | Optional; default `5000`. |
| `GEMINI_MODEL` | Optional; default `gemini-2.0-flash`. If you get model errors, try `gemini-1.5-flash`. |

No database password or API key belongs in HTML, `app.js`, or `server.js` — only `process.env` via `dotenv`.

---

## API (Express)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/` | Health + endpoint list |
| `POST` | `/api/documents/upload` | Multipart field name: **`document`** |
| `GET` | `/api/documents` | Recent analyses (for results list) |
| `GET` | `/api/documents/:id` | One record (for results table) |

---

## Run locally

1. **Atlas**: Create a cluster, database user, network access (your IP or `0.0.0.0/0` for demo), get connection string, replace `<password>` with the user’s password.

2. **Backend**
   ```bash
   cd backend
   copy .env-example .env
   # Edit .env: GEMINI_API_KEY=...  MONGODB_URI=mongodb+srv://...
   npm install
   npm start
   ```

3. **Browser** (same origin as API — served by Express):
   - `http://localhost:5000/` — home  
   - `http://localhost:5000/upload.html` — upload  
   - `http://localhost:5000/results.html` — table + history  

Open the site via **http://localhost:PORT**, not `file://`, so `fetch` calls `/api` correctly.

---

## Disclaimer

Outputs are **AI-generated, for demonstration only** — not legal advice.
