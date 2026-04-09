

function predictRiskLevel(riskAnalysisText) {
  const text = String(riskAnalysisText || "").trim();
  const t = text.toLowerCase();

  if (!text) return "Medium";

  if (/\bhigh\b/.test(t) || /\bmajor\b/.test(t) || /\bsevere\b/.test(t))
    return "High";
  if (/\blow\b/.test(t) || /\bminor\b/.test(t) || /\blimited\b/.test(t))
    return "Low";
  if (/\bmedium\b/.test(t) || /\bmoderate\b/.test(t)) return "Medium";

  const highSignals = [
    "termination",
    "eviction",
    "default",
    "penalty",
    "liability",
    "indemnif",
    "breach",
    "damages",
    "confiscat",
    "forfeit",
    "summary judgment",
  ];
  const lowSignals = ["appeal", "dismiss", "nominal", "unlikely", "limited liability"];

  const highHits = highSignals.reduce((acc, s) => acc + (t.includes(s) ? 1 : 0), 0);
  const lowHits = lowSignals.reduce((acc, s) => acc + (t.includes(s) ? 1 : 0), 0);

  if (highHits >= 2) return "High";
  if (lowHits >= 2 && highHits === 0) return "Low";
  return "Medium";
}

module.exports = { predictRiskLevel };