"use client";

import Link from "next/link";
import { useState } from "react";

export default function TestPage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const createDummyRecord = async () => {
    setLoading(true);
    setStatus("Creating dummy record...");

    try {
      const response = await fetch("/api/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ Dummy record created successfully! ID: ${data.id}`);
      } else {
        setStatus(`❌ Failed to create dummy record: ${data.error}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const checkScoring = () => {
    // Expected scoring breakdown
    const expectedScores = {
      Introduction: 10,
      "History Taking": 20,
      "Risk Assessment": 20,
      "Health Advice": 20,
      Documentation: 10,
      "Communication Skills": 10,
      Professionalism: 10,
    };

    const totalExpected = Object.values(expectedScores).reduce(
      (sum, score) => sum + score,
      0,
    );

    setStatus(`
📊 Expected Scoring Breakdown:
Total Possible Score: ${totalExpected} points

Section Breakdown:
• Introduction: ${expectedScores["Introduction"]} points
• History Taking: ${expectedScores["History Taking"]} points
• Risk Assessment: ${expectedScores["Risk Assessment"]} points
• Health Advice: ${expectedScores["Health Advice"]} points
• Documentation: ${expectedScores["Documentation"]} points
• Communication Skills: ${expectedScores["Communication Skills"]} points
• Professionalism: ${expectedScores["Professionalism"]} points

🔍 Known Issues to Check:
1. Are scores being calculated properly in calculateScores()?
2. Are scores being submitted correctly to the database?
3. Are scores being displayed correctly in the admin panel?
4. Is the totalScore field being saved as a number or string?
    `);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Quiz System Test Page
          </h1>

          <div className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Scoring Verification
              </h2>
              <p className="text-gray-600 mb-4">
                Check the expected scoring breakdown and verify calculations.
              </p>
              <button
                onClick={checkScoring}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Show Expected Scores
              </button>
            </div>

            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Database Testing
              </h2>
              <p className="text-gray-600 mb-4">
                Create a dummy record with perfect scores to test the admin
                panel display.
              </p>
              <button
                onClick={createDummyRecord}
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Dummy Record"}
              </button>
            </div>

            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Quick Links
              </h2>
              <div className="space-x-4">
                <Link
                  href="/"
                  className="inline-block bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Take Quiz
                </Link>
                <a
                  href="/admin"
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
                >
                  Admin Panel
                </a>
              </div>
            </div>

            <div className="bg-gray-50 rounded p-6">
              <h3 className="font-semibold text-gray-700 mb-2">Status:</h3>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                {status || "No actions performed yet."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
