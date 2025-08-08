"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/lib/store";
import { quizData } from "@/lib/quizData";

interface UserInfoFormProps {
  onStart: (name: string, email: string) => void;
}

function UserInfoForm({ onStart }: UserInfoFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onStart(name.trim(), email.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Travel Health Assessment
          </h1>
          <p className="text-gray-600">
            Please provide your information to begin the assessment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 px-6 rounded font-semibold hover:bg-gray-800 transition-colors duration-200"
          >
            Start Assessment
          </button>
        </form>
      </motion.div>
    </div>
  );
}

interface QuizQuestionProps {
  sectionIndex: number;
  criteriaIndex: number;
  onAnswer: (selectedOption: string, points: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  selectedAnswer?: string;
  canGoBack: boolean;
}

function QuizQuestion({
  sectionIndex,
  criteriaIndex,
  onAnswer,
  onNext,
  onPrevious,
  selectedAnswer,
  canGoBack,
}: QuizQuestionProps) {
  const section = quizData[sectionIndex];
  const criteria = section.criteria[criteriaIndex];
  const progress = useQuizStore((state) => state.getProgress());
  const currentQuestionNumber = useQuizStore((state) =>
    state.getCurrentQuestionNumber(),
  );
  const totalQuestions = useQuizStore((state) => state.getTotalQuestions());

  const [textValue, setTextValue] = useState(selectedAnswer || "");

  const calculatePoints = (answer: string) => {
    if (!answer || !answer.trim()) return 0;

    switch (criteria.inputType) {
      case "binary":
        const positiveAnswers = [
          "Yes",
          "Provided",
          "Discussed",
          "Completed",
          "Consistently",
        ];
        const binaryPoints = positiveAnswers.includes(answer)
          ? criteria.points
          : 0;

        return binaryPoints;

      case "multiple":
        let multiplePoints = 0;
        // Award more points for better quality answers
        if (
          [
            "Excellent",
            "Consistently",
            "Very familiar",
            "Yes, listed",
            "Discussed thoroughly",
          ].includes(answer)
        ) {
          multiplePoints = criteria.points;
        } else if (
          [
            "Good",
            "Sometimes",
            "Somewhat familiar",
            "Partially",
            "Yes",
            "Somewhat",
            "Mostly",
          ].includes(answer)
        ) {
          multiplePoints = Math.round(criteria.points * 0.8);
        } else if (
          [
            "Fair",
            "Rarely",
            "Not familiar",
            "Discussed briefly",
            "No",
            "Somewhat aware",
          ].includes(answer)
        ) {
          multiplePoints = Math.round(criteria.points * 0.5);
        } else if (
          [
            "Poor",
            "Never",
            "Not discussed",
            "Not applicable",
            "Not aware",
            "Unsure",
          ].includes(answer)
        ) {
          multiplePoints = Math.round(criteria.points * 0.2);
        } else {
          // Default scoring for other multiple choice options
          const optionIndex = criteria.options?.indexOf(answer) || 0;
          multiplePoints = Math.round(
            criteria.points *
              Math.max(0.1, 1 - optionIndex / (criteria.options?.length || 1)),
          );
        }

        return multiplePoints;

      case "shortText":
      case "longText":
        // Award full points for any meaningful text input (more than 3 characters)
        const textPoints = answer.trim().length > 3 ? criteria.points : 0;

        return textPoints;

      default:
        return 0;
    }
  };

  const handleOptionSelect = (option: string) => {
    const points = calculatePoints(option);
    onAnswer(option, points);
  };

  const handleTextSubmit = () => {
    if (textValue.trim()) {
      const points = calculatePoints(textValue);
      onAnswer(textValue, points);
    }
  };

  const renderInput = () => {
    switch (criteria.inputType) {
      case "binary":
      case "multiple":
        return (
          <div className="space-y-3">
            {criteria.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 text-left border rounded transition-colors duration-200 ${
                  selectedAnswer === option
                    ? "border-gray-900 bg-gray-100 text-gray-900"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      selectedAnswer === option
                        ? "border-gray-900 bg-gray-900"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswer === option && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case "shortText":
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={criteria.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200"
            />
            <button
              onClick={handleTextSubmit}
              disabled={!textValue.trim()}
              className={`w-full py-3 px-6 rounded font-semibold transition-colors duration-200 ${
                textValue.trim()
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Answer
            </button>
          </div>
        );

      case "longText":
        return (
          <div className="space-y-4">
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={criteria.placeholder}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors duration-200 resize-none"
            />
            <button
              onClick={handleTextSubmit}
              disabled={!textValue.trim()}
              className={`w-full py-3 px-6 rounded font-semibold transition-colors duration-200 ${
                textValue.trim()
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Answer
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestionNumber} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {section.section}
          </h2>
          <h3 className="text-2xl font-bold text-gray-800">
            {criteria.description}
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            {criteria.points} point{criteria.points !== 1 ? "s" : ""} possible
          </p>
        </div>

        {/* Input Area */}
        <div className="mb-8">{renderInput()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onPrevious}
            disabled={!canGoBack}
            className={`px-6 py-3 rounded font-semibold transition-colors duration-200 ${
              canGoBack
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Previous
          </button>

          <button
            onClick={onNext}
            disabled={!selectedAnswer}
            className={`px-6 py-3 rounded font-semibold transition-colors duration-200 ${
              selectedAnswer
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {currentQuestionNumber === totalQuestions ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ThankYouPageProps {
  onRestart: () => void;
}

function ThankYouPage({ onRestart }: ThankYouPageProps) {
  const { userInfo } = useQuizStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-2xl text-center">
        <div>
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Assessment Completed!
            </h1>
            <p className="text-gray-600">
              Thank you, {userInfo?.name}, for completing the travel health
              assessment.
            </p>
          </div>

          <div className="bg-gray-50 rounded p-6 mb-8">
            <p className="text-gray-800 mb-4">
              Your responses have been successfully submitted and recorded.
            </p>
            <p className="text-gray-600 text-sm">
              The assessment administrator will review your responses and
              provide feedback accordingly.
            </p>
          </div>

          <button
            onClick={onRestart}
            className="bg-gray-900 text-white py-3 px-8 rounded font-semibold hover:bg-gray-800 transition-colors duration-200"
          >
            Take Another Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const {
    userInfo,
    setUserInfo,
    currentSection,
    currentCriteria,
    responses,
    setResponse,
    nextQuestion,
    previousQuestion,
    isCompleted,
    resetQuiz,
  } = useQuizStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleStart = (name: string, email: string) => {
    setUserInfo({ name, email });
  };

  const handleAnswer = (selectedOption: string, points: number) => {
    // Answer saved
    setResponse(currentSection, currentCriteria, selectedOption, points);
  };

  const handleNext = async () => {
    const isLastQuestion =
      currentSection === quizData.length - 1 &&
      currentCriteria === quizData[currentSection].criteria.length - 1;

    if (isLastQuestion) {
      // Auto-submit when finishing the last question
      await submitQuiz();
    } else {
      nextQuestion();
    }
  };

  const submitQuiz = async () => {
    if (!userInfo || isSubmitted) return;

    setIsSubmitting(true);

    try {
      // First ensure scores are calculated before submission
      const { calculateScores } = useQuizStore.getState();
      calculateScores();

      // Get fresh calculated values after calculation
      const freshState = useQuizStore.getState();

      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          responses: freshState.responses,
          totalScore: freshState.totalScore,
          sectionScores: freshState.sectionScores,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Complete the quiz after successful submission
        useQuizStore.getState().completeQuiz();
      } else {
        // Failed to submit quiz, but continue
        useQuizStore.getState().completeQuiz();
      }
    } catch {
      // Error submitting quiz, but continue
      useQuizStore.getState().completeQuiz();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoBack = currentSection > 0 || currentCriteria > 0;

  const getSelectedAnswer = () => {
    return responses[currentSection]?.[currentCriteria]?.selectedOption;
  };

  // Show thank you page after completion
  if (isCompleted) {
    return <ThankYouPage onRestart={resetQuiz} />;
  }

  // Show user info form at the beginning
  if (!userInfo) {
    return <UserInfoForm onStart={handleStart} />;
  }

  // Show loading state during submission
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Submitting Assessment
          </h2>
          <p className="text-gray-600">
            Please wait while we save your responses...
          </p>
        </div>
      </div>
    );
  }

  // Show quiz questions
  return (
    <AnimatePresence mode="wait">
      <QuizQuestion
        key={`${currentSection}-${currentCriteria}`}
        sectionIndex={currentSection}
        criteriaIndex={currentCriteria}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={previousQuestion}
        selectedAnswer={getSelectedAnswer()}
        canGoBack={canGoBack}
      />
    </AnimatePresence>
  );
}
