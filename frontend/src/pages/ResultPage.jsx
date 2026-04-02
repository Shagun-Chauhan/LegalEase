import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Scale,
  BarChart,
  ShieldAlert,
  FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function ResultPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return <div className="p-10">No Data</div>;

  const riskColor =
    data.riskLevel === "High"
      ? "text-red-500"
      : data.riskLevel === "Medium"
      ? "text-yellow-500"
      : "text-green-500";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <Sidebar />

      <main className="md:ml-64 pt-16 p-6 max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Document Analysis Report
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {data.legalProcessType} · AI Generated Analysis
          </p>
        </div>

        {/* TOP SUMMARY GRID */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          {/* Risk Score */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <BarChart size={16} />
              <p className="text-sm font-semibold">Risk Score</p>
            </div>

            <p className={`text-3xl font-bold ${riskColor}`}>
              {data.riskScore}/10
            </p>

            <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded">
              <div
                className="h-2 bg-red-500 rounded"
                style={{ width: `${data.riskScore * 10}%` }}
              />
            </div>
          </div>

          {/* Risk Level */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={16} />
              <p className="text-sm font-semibold">Risk Level</p>
            </div>

            <p className={`text-xl font-bold ${riskColor}`}>
              {data.riskLevel}
            </p>
          </div>

          {/* Dominant Party */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Scale size={16} />
              <p className="text-sm font-semibold">Dominant Party</p>
            </div>

            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              {data.dominantParty || "Not detected"}
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 mb-6">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-2">
            Document Summary
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {data.documentSummary}
          </p>
        </div>

        {/* KEY POINTS */}
        <div className="mb-6">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle size={16} /> Key Points
          </h2>

          <div className="grid md:grid-cols-2 gap-3">
            {data.keyPoints.map((p, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700"
              >
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RED FLAGS */}
        <div className="mb-6">
          <h2 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} /> Risky Clauses
          </h2>

          <div className="space-y-3">
            {data.redFlags?.map((r, i) => (
              <div
                key={i}
                className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800"
              >
                <p className="text-sm text-red-700 dark:text-red-300">
                  {r}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FINANCIAL + TIME */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700">
            <h3 className="font-semibold mb-2 text-slate-800 dark:text-white">
              Estimated Cost
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {data.estimatedCost}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700">
            <h3 className="font-semibold mb-2 text-slate-800 dark:text-white">
              Estimated Time
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {data.estimatedTime}
            </p>
          </div>
        </div>

        {/* SUCCESS PROBABILITY */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border dark:border-slate-700 mb-6">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-2">
            Success Probability
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {data.successProbability}
          </p>
        </div>

        {/* SIMPLE EXPLANATION */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <h2 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
            Simple Explanation
          </h2>
          <p className="text-sm text-indigo-700 dark:text-indigo-200">
            {data.simpleExplanation}
          </p>
        </div>

      </main>
    </div>
  );
}