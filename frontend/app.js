/**
 * LegalEase frontend — upload flow + results table (same-origin API).
 */
(function () {
 const API_BASE = "http://localhost:5000/api";

  const page = document.body.getAttribute("data-page");

  function fmtDate(iso) {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return String(iso);
    }
  }

  /* ---------- Upload ---------- */
  function initUpload() {
    const form = document.getElementById("uploadForm");
    if (!form) return;

    const fileInput = document.getElementById("fileInput");
    const submitBtn = document.getElementById("submitBtn");
    const statusMsg = document.getElementById("statusMsg");

    function setLoading(loading) {
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? "Analyzing…" : "Analyze with AI";
    }

    function showStatus(msg, kind) {
      statusMsg.textContent = msg;
      statusMsg.classList.remove("ok", "error");
      if (kind) statusMsg.classList.add(kind);
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const file = fileInput.files[0];
      if (!file) {
        showStatus("Choose a file first.", "error");
        return;
      }

      const fd = new FormData();
      fd.append("document", file);

      setLoading(true);
      showStatus("Uploading and calling Gemini…", "");

      try {
        const res = await fetch(`${API_BASE}/documents/upload`, {
  method: "POST",
  body: fd,
  headers: {
    Accept: "application/json",
  },
});
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          showStatus(data.error || `Request failed (${res.status})`, "error");
          return;
        }

        if (data.id) {
          showStatus("Saved to database. Opening results…", "ok");
          window.location.href = `results.html?id=${encodeURIComponent(data.id)}`;
          return;
        }

        showStatus("Unexpected response from server.", "error");
      } catch (err) {
        console.error(err);
        showStatus(
          "Cannot reach the API. Start the backend and open this site via http://localhost:PORT (not file://).",
          "error"
        );
      } finally {
        setLoading(false);
      }
    });
  }

  /* ---------- Results (detail table + list) ---------- */
  function initResults() {
    const intro = document.getElementById("resultsIntro");
    const detailSection = document.getElementById("detailSection");
    const listBody = document.getElementById("listTableBody");
    const detailBody = document.getElementById("detailTableBody");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    function renderDetailRow(label, value) {
      const tr = document.createElement("tr");
      const tdL = document.createElement("td");
      tdL.textContent = label;
      const tdV = document.createElement("td");
      const div = document.createElement("div");
      div.className = "cell-text";
      div.textContent = value && String(value).trim() ? value : "—";
      tdV.appendChild(div);
      tr.appendChild(tdL);
      tr.appendChild(tdV);
      return tr;
    }

    async function loadDetail(docId) {
      const res = await fetch(`${API_BASE}/documents/${docId}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        intro.textContent = data.error || "Could not load this document.";
        detailSection.classList.add("hidden");
        return;
      }

      intro.textContent =
        "Structured output from Gemini. Values are indicative only — not legal advice.";
      detailSection.classList.remove("hidden");

      document.getElementById("metaFile").textContent = data.originalFileName || "—";
      document.getElementById("metaDate").textContent = fmtDate(data.uploadedAt);
      document.getElementById("metaId").textContent = String(data.id || docId);

      detailBody.innerHTML = "";
      const rows = [
        ["Document summary", data.documentSummary],
        ["Key points", data.keyPoints],
        ["Legal process type", data.legalProcessType],
        ["Estimated time", data.estimatedTime],
        ["Estimated cost", data.estimatedCost],
        ["Success probability", data.successProbability],
        ["Risk level", data.riskLevel],
        ["Risk analysis", data.riskAnalysis],
      ];
      rows.forEach(([label, val]) => {
        detailBody.appendChild(renderDetailRow(label, val));
      });
    }

    async function loadList() {
      try {
        const res = await fetch(`${API_BASE}/documents`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          listBody.innerHTML = `<tr><td colspan="5">${data.error || "Failed to load list."}</td></tr>`;
          return;
        }

        const docs = data.documents || [];
        if (docs.length === 0) {
          listBody.innerHTML =
            '<tr><td colspan="5">No analyses yet. Upload a document first.</td></tr>';
          return;
        }

        listBody.innerHTML = "";
        docs.forEach((d) => {
          const tr = document.createElement("tr");
          const link = `results.html?id=${encodeURIComponent(d.id)}`;
          tr.innerHTML = `
            <td class="cell-text">${escapeHtml(d.originalFileName || "—")}</td>
            <td class="cell-text">${escapeHtml(d.legalProcessType || "—")}</td>
            <td class="cell-text">${escapeHtml(d.riskLevel || "—")}</td>
            <td>${escapeHtml(fmtDate(d.uploadedAt))}</td>
            <td><a href="${link}">View</a></td>
          `;
          listBody.appendChild(tr);
        });
      } catch (e) {
        console.error(e);
        listBody.innerHTML =
          '<tr><td colspan="5">Network error — is the backend running?</td></tr>';
      }
    }

    function escapeHtml(s) {
      const div = document.createElement("div");
      div.textContent = s;
      return div.innerHTML;
    }

    if (id) {
      loadDetail(id).catch((e) => {
        console.error(e);
        intro.textContent = "Error loading document.";
      });
    } else {
      intro.textContent =
        "Pick a row below or open a direct link after upload (?id=…).";
      detailSection.classList.add("hidden");
    }

    loadList();
  }

  if (page === "upload") initUpload();
  if (page === "results") initResults();
})();
