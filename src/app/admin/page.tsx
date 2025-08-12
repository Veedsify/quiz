"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { quizData } from "@/lib/quizData";

interface QuizResponse {
  id: number;
  name: string;
  email: string;
  accessorsName: string;
  accessorsEmail: string;
  responses: string;
  totalScore: number;
  sectionScores: string;
  completedAt: string;
}

interface SectionScore {
  section: string;
  score: number;
  totalPoints: number;
}

interface ResponseData {
  [sectionIndex: number]: {
    [criteriaIndex: number]: {
      selectedOption: string;
      points: number;
    };
  };
}

interface AdminLoginProps {
  onLogin: (password: string) => void;
  error?: string;
  loading?: boolean;
}

function AdminLogin({ onLogin, error, loading }: AdminLoginProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-emerald-200 shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/NSTM.png"
              alt="Nigerian Society of Travel Medicine"
              width={80}
              height={80}
              className="bg-emerald-50 rounded-full shadow-lg p-2"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">
            Admin Access
          </h1>
          <p className="text-emerald-600">
            Enter the admin password to view assessment responses
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 ${
                error ? "border-red-500" : "border-emerald-300"
              }`}
              placeholder="Enter admin password"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? "Authenticating..." : "Access Admin Panel"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

interface ResponseDetailProps {
  response: QuizResponse;
  onClose: () => void;
}

function ResponseDetail({ response, onClose }: ResponseDetailProps) {
  const responses: ResponseData = JSON.parse(response.responses);
  const sectionScores: SectionScore[] = JSON.parse(response.sectionScores);
  const totalPossible = quizData.reduce(
    (sum, section) => sum + section.totalPoints,
    0,
  );
  const percentage = Math.round((response.totalScore / totalPossible) * 100);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg border border-gray-200 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Assessment Details
              </h2>
              <div className="space-y-1">
                <p className="text-gray-600">
                  <span className="font-medium">Candidate:</span>{" "}
                  {response.name}
                  {response.email && response.email !== "Not provided" && (
                    <span> ({response.email})</span>
                  )}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Assessor:</span>{" "}
                  {response.accessorsName} ({response.accessorsEmail})
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Completed: {new Date(response.completedAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Overall Score */}
          <div className="bg-gray-50 rounded p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Overall Score
            </h3>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {response.totalScore} / {totalPossible}
            </div>
            <div className="text-lg text-gray-600">{percentage}%</div>
          </div>

          {/* Section Scores */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Section Breakdown
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sectionScores.map((section) => (
                <div key={section.section} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {section.section}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {section.score} / {section.totalPoints}
                    </span>
                    <span className="font-medium text-gray-900">
                      {Math.round((section.score / section.totalPoints) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(section.score / section.totalPoints) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Responses */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Detailed Responses
            </h3>
            <div className="space-y-6">
              {quizData.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded p-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    {section.section}
                  </h4>
                  <div className="space-y-4">
                    {section.criteria.map((criteria, criteriaIndex) => {
                      const userResponse =
                        responses[sectionIndex]?.[criteriaIndex];
                      return (
                        <div
                          key={criteriaIndex}
                          className="bg-gray-50 rounded p-4"
                        >
                          <p className="font-medium text-gray-800 mb-2">
                            {criteria.description}
                          </p>
                          <div className="mb-2">
                            {criteria.inputType === "longText" ||
                            criteria.inputType === "shortText" ? (
                              <div className="bg-white p-3 rounded border">
                                <p className="text-gray-800 whitespace-pre-wrap">
                                  {userResponse?.selectedOption ||
                                    "No response"}
                                </p>
                              </div>
                            ) : (
                              <span
                                className={`inline-block px-3 py-1 rounded text-sm ${
                                  userResponse
                                    ? "bg-gray-200 text-gray-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {userResponse?.selectedOption || "No response"}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Input Type: {criteria.inputType}
                            </span>
                            <span className="text-sm text-gray-600 font-medium">
                              {userResponse?.points || 0} / {criteria.points}{" "}
                              points
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface ResponsesTableProps {
  responses: QuizResponse[];
  onViewDetail: (response: QuizResponse) => void;
  onDelete: (response: QuizResponse) => void;
  onLogout: () => void;
}

function ResponsesTable({
  responses,
  onViewDetail,
  onDelete,
  onLogout,
}: ResponsesTableProps) {
  const totalPossible = quizData.reduce(
    (sum, section) => sum + section.totalPoints,
    0,
  );

  return (
    <div className="min-h-screen p-0 lg:p-8 bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="bg-white  min-h-screen rounded-xl border border-emerald-200 shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Image
                  src="/NSTM.png"
                  alt="Nigerian Society of Travel Medicine"
                  width={60}
                  height={60}
                  className="rounded-full shadow-md mr-4"
                  priority
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Assessment Dashboard
                  </h1>
                  <p className="text-gray-600">
                    {responses.length} total responses
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {responses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No responses yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">
                      Candidate Name
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">
                      Candidate Email
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">
                      Assessor Name
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">
                      Assessor Email
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">
                      Score
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">
                      Percentage
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">
                      Completed
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => {
                    const percentage = Math.round(
                      (response.totalScore / totalPossible) * 100,
                    );
                    return (
                      <tr
                        key={response.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-6 text-gray-800">
                          {response.name}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {response.email && response.email !== "Not provided"
                            ? response.email
                            : "Not provided"}
                        </td>
                        <td className="py-4 px-6 text-gray-800">
                          {response.accessorsName}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {response.accessorsEmail}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-900">
                            {response.totalScore} / {totalPossible}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              percentage >= 80
                                ? "bg-gray-800 text-white"
                                : percentage >= 60
                                  ? "bg-gray-600 text-white"
                                  : "bg-gray-400 text-white"
                            }`}
                          >
                            {percentage}%
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(response.completedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onViewDetail(response)}
                              className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => onDelete(response)}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | undefined>();
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<QuizResponse | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] = useState<QuizResponse | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (password: string) => {
    setLoading(true);
    setLoginError(undefined);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          action: "getAll",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setResponses(data.data);
        setAdminPassword(password); // Store password for future API calls
      } else {
        setLoginError(data.error || "Authentication failed");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (response: QuizResponse) => {
    setSelectedResponse(response);
  };

  const handleCloseDetail = () => {
    setSelectedResponse(null);
  };

  const handleDelete = (response: QuizResponse) => {
    setDeleteConfirm(response);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: adminPassword,
          action: "delete",
          id: deleteConfirm.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the deleted response from the list
        setResponses(responses.filter((r) => r.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      } else {
        alert(data.error || "Failed to delete response");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin onLogin={handleLogin} error={loginError} loading={loading} />
    );
  }

  return (
    <>
      <ResponsesTable
        responses={responses}
        onViewDetail={handleViewDetail}
        onDelete={handleDelete}
        onLogout={() => setIsAuthenticated(false)}
      />
      <AnimatePresence>
        {selectedResponse && (
          <ResponseDetail
            response={selectedResponse}
            onClose={handleCloseDetail}
          />
        )}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the response from{" "}
                <strong>{deleteConfirm.name}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
