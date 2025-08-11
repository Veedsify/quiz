"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { quizData, Criteria, Section } from "@/lib/quizData";

interface ChecklistResponse {
  selectedOption: string;
  points: number;
}

interface ChecklistResponses {
  [sectionIndex: number]: {
    [criteriaIndex: number]: ChecklistResponse;
  };
}

export default function DoctorChecklistPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [responses, setResponses] = useState<ChecklistResponses>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const calculatePoints = (selectedOption: string, criteria: Criteria) => {
    if (!selectedOption || !selectedOption.trim()) return 0;

    switch (criteria.inputType) {
      case "binary": {
        // Award full points for positive binary labels; zero for negatives
        const positive = [
          "yes",
          "provided",
          "discussed",
          "completed",
          "arranged",
          "done",
          "true",
        ];
        const sel = selectedOption.trim().toLowerCase();
        return positive.includes(sel) ? criteria.points : 0;
      }

      case "multiple":
        // Award points based on quality of response - scale properly
        if (
          [
            "Excellent",
            "Comprehensive",
            "Detailed explanation",
            "Actively encouraged",
            "Complete and accurate",
            "Arranged when needed",
            "Discussed thoroughly",
            "Used multiple sources",
          ].includes(selectedOption)
        ) {
          return criteria.points; // 100% of points
        } else if (
          [
            "Good",
            "Adequate",
            "Basic advice",
            "Responded well",
            "Mostly complete",
            "Used one source",
          ].includes(selectedOption)
        ) {
          return Math.round(criteria.points * 0.75); // 75% of points
        } else if (
          [
            "Fair",
            "Basic",
            "Brief mention",
            "Minimal encouragement",
            "Basic documentation",
            "Mentioned briefly",
            "Discussed briefly",
          ].includes(selectedOption)
        ) {
          return Math.round(criteria.points * 0.5); // 50% of points
        } else if (
          [
            "Poor",
            "Inadequate",
            "Not discussed",
            "Discouraged questions",
            "Relied on memory",
            "No consultation",
          ].includes(selectedOption)
        ) {
          return 0; // 0% of points for poor performance
        } else if (
          [
            "Not applicable",
            "Not needed",
            "Should have arranged",
            "Unclear",
          ].includes(selectedOption)
        ) {
          return criteria.points; // Full points for N/A when appropriate
        } else {
          // For any other options, award 25% of points
          return Math.round(criteria.points * 0.25);
        }

      case "shortText":
      case "longText":
        // Award full points for any meaningful text input
        return selectedOption.trim().length > 2 ? criteria.points : 0;

      default:
        return 0;
    }
  };

  const handleResponse = (
    sectionIndex: number,
    criteriaIndex: number,
    selectedOption: string,
    criteria: Criteria,
  ) => {
    const points = calculatePoints(selectedOption, criteria);
    setResponses((prev) => ({
      ...prev,
      [sectionIndex]: {
        ...prev[sectionIndex],
        [criteriaIndex]: {
          selectedOption,
          points,
        },
      },
    }));
  };

  // const clearResponse = (sectionIndex: number, criteriaIndex: number) => {
  //   setResponses((prev) => {
  //     const next = { ...prev };
  //     if (next[sectionIndex]) {
  //       delete next[sectionIndex][criteriaIndex];
  //       if (Object.keys(next[sectionIndex]).length === 0) {
  //         delete next[sectionIndex];
  //       }
  //     }
  //     return next;
  //   });
  // };

  const calculateScores = () => {
    let totalScore = 0;
    const sectionScores = quizData.map((section) => {
      let sectionScore = 0;
      const sectionIndex = quizData.indexOf(section);

      if (responses[sectionIndex]) {
        section.criteria.forEach((criteria, criteriaIndex) => {
          const response = responses[sectionIndex][criteriaIndex];
          if (response) {
            sectionScore += response.points;
          }
        });
      }

      totalScore += sectionScore;
      return {
        section: section.section,
        score: sectionScore,
        totalPoints: section.totalPoints,
      };
    });

    return { totalScore, sectionScores };
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setSubmitMessage("Please enter a name before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const { totalScore, sectionScores } = calculateScores();

      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || "Not provided",
          responses,
          totalScore,
          sectionScores,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setSubmitMessage("Assessment submitted successfully!");
      } else {
        setSubmitMessage(
          `Failed to submit assessment: ${responseData.error || "Unknown error"}. Please try again.`,
        );
      }
    } catch (error) {
      setSubmitMessage(
        `Error submitting assessment: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setResponses({});
    setIsSubmitted(false);
    setSubmitMessage("");
  };

  const renderInput = (
    section: Section,
    sectionIndex: number,
    criteria: Criteria,
    criteriaIndex: number,
  ) => {
    const currentResponse = responses[sectionIndex]?.[criteriaIndex];

    switch (criteria.inputType) {
      case "binary":
        return (
          <div className="flex gap-6">
            {criteria.options?.map((option: string) => {
              const isSelected = currentResponse?.selectedOption === option;

              return (
                <label
                  key={option}
                  className={`flex items-center cursor-pointer px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${sectionIndex}-${criteriaIndex}`}
                    value={option}
                    checked={isSelected}
                    onChange={() => {
                      handleResponse(
                        sectionIndex,
                        criteriaIndex,
                        option,
                        criteria,
                      );
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-sm">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case "multiple":
        return (
          <div className="relative">
            <select
              value={currentResponse?.selectedOption || ""}
              onChange={(e) => {
                if (e.target.value) {
                  handleResponse(
                    sectionIndex,
                    criteriaIndex,
                    e.target.value,
                    criteria,
                  );
                }
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white text-gray-700 font-medium appearance-none cursor-pointer"
            >
              <option value="" className="text-gray-500">
                Select an option...
              </option>
              {criteria.options?.map((option: string) => (
                <option key={option} value={option} className="py-2">
                  {option}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        );

      case "shortText":
        return (
          <input
            type="text"
            value={currentResponse?.selectedOption || ""}
            onChange={(e) =>
              handleResponse(
                sectionIndex,
                criteriaIndex,
                e.target.value,
                criteria,
              )
            }
            placeholder={criteria.placeholder}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-medium"
          />
        );

      case "longText":
        return (
          <textarea
            value={currentResponse?.selectedOption || ""}
            onChange={(e) =>
              handleResponse(
                sectionIndex,
                criteriaIndex,
                e.target.value,
                criteria,
              )
            }
            placeholder={criteria.placeholder}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-vertical font-medium"
          />
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    const { totalScore } = calculateScores();
    const totalPossible = quizData.reduce(
      (sum, section) => sum + section.totalPoints,
      0,
    );

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-emerald-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 w-full max-w-lg text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Assessment Complete
          </h2>

          <p className="text-gray-600 mb-8 text-lg">
            The doctor assessment has been submitted successfully.
          </p>

          <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-xl p-6 mb-8 border border-emerald-100">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Total Score
            </p>
            <p className="text-4xl font-bold text-gray-800 mb-1">
              {totalScore}
            </p>
            <p className="text-lg text-gray-600">
              out of {totalPossible} points
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div
                className="bg-gradient-to-r from-emerald-500 to-indigo-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(totalScore / totalPossible) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-8 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start New Assessment
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-10 py-12 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Doctor Assessment Checklist
            </h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Comprehensive evaluation tool for assessing doctor performance
              during travel health consultations
            </p>
          </div>

          <div className="p-10">
            {/* User Info */}
            <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl p-8 mb-12 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                Assessment Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Doctor/Assessor Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-medium"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-3"
                  >
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 font-medium"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            {/* Checklist Sections */}
            <div className="space-y-10">
              {quizData.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="border border-black/30 rounded-xl p-8 bg-white transition-shadow duration-200"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-4 text-white font-bold text-sm">
                        {sectionIndex + 1}
                      </div>
                      {section.section}
                    </h3>
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-4 py-2 rounded-full">
                      {section.totalPoints} points
                    </span>
                  </div>

                  <div className="space-y-8">
                    {section.criteria.map((criteria, criteriaIndex) => (
                      <div key={criteriaIndex} className=" p-4">
                        <div className="flex justify-between items-start mb-4">
                          <label className="block text-base font-medium text-gray-700 flex-1 leading-relaxed">
                            {criteria.description}
                          </label>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full ml-6 whitespace-nowrap">
                            {criteria.points} pts
                          </span>
                        </div>
                        <div className="mt-4">
                          {renderInput(
                            section,
                            sectionIndex,
                            criteria,
                            criteriaIndex,
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Submit Section */}
            <div className="mt-12 pt-8 border-t-2 border-gray-100">
              {submitMessage && (
                <div
                  className={`mb-6 p-4 rounded-xl border-2 ${
                    submitMessage.includes("successfully")
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className={`w-5 h-5 mr-2 ${
                        submitMessage.includes("successfully")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={
                          submitMessage.includes("successfully")
                            ? "M5 13l4 4L19 7"
                            : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        }
                      />
                    </svg>
                    {submitMessage}
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !name.trim()}
                  className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg ${
                    isSubmitting || !name.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-indigo-700 text-white hover:from-emerald-700 hover:to-indigo-800 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    "Submit Assessment"
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6 bg-gray-50 rounded-lg p-4">
                  <span className="font-medium">Note:</span> Name is required to
                  submit. All checklist items are optional - only mark what
                  applies during the consultation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
