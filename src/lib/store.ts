import { create } from "zustand";
import { ResponseData, SectionScore } from "./database";
import { quizData, Section, Criteria } from "./quizData";

interface UserInfo {
  name: string;
  email: string;
}

interface QuizState {
  // User information
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;

  // Quiz navigation
  currentSection: number;
  currentCriteria: number;
  setCurrentSection: (section: number) => void;
  setCurrentCriteria: (criteria: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;

  // Quiz responses
  responses: ResponseData;
  setResponse: (
    sectionIndex: number,
    criteriaIndex: number,
    selectedOption: string,
    points: number,
  ) => void;

  // Quiz completion
  isCompleted: boolean;
  totalScore: number;
  sectionScores: SectionScore[];
  calculateScores: () => void;
  completeQuiz: () => void;

  // Reset functionality
  resetQuiz: () => void;

  // Progress tracking
  getProgress: () => number;
  getTotalQuestions: () => number;
  getCurrentQuestionNumber: () => number;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  userInfo: null,
  currentSection: 0,
  currentCriteria: 0,
  responses: {},
  isCompleted: false,
  totalScore: 0,
  sectionScores: [],

  // Actions
  setUserInfo: (info) => set({ userInfo: info }),

  setCurrentSection: (section) => set({ currentSection: section }),

  setCurrentCriteria: (criteria) => set({ currentCriteria: criteria }),

  nextQuestion: () => {
    const state = get();

    // If not at the last criteria in current section
    if (
      state.currentCriteria <
      quizData[state.currentSection].criteria.length - 1
    ) {
      set({ currentCriteria: state.currentCriteria + 1 });
    }
    // If at last criteria but not last section
    else if (state.currentSection < quizData.length - 1) {
      set({
        currentSection: state.currentSection + 1,
        currentCriteria: 0,
      });
    }
    // If at the very last question
    else {
      state.completeQuiz();
    }
  },

  previousQuestion: () => {
    const state = get();

    // If not at the first criteria in current section
    if (state.currentCriteria > 0) {
      set({ currentCriteria: state.currentCriteria - 1 });
    }
    // If at first criteria but not first section
    else if (state.currentSection > 0) {
      const prevSection = state.currentSection - 1;
      const prevSectionLastCriteria = quizData[prevSection].criteria.length - 1;
      set({
        currentSection: prevSection,
        currentCriteria: prevSectionLastCriteria,
      });
    }
  },

  setResponse: (sectionIndex, criteriaIndex, selectedOption, points) => {
    const state = get();
    const newResponses = { ...state.responses };

    if (!newResponses[sectionIndex]) {
      newResponses[sectionIndex] = {};
    }

    newResponses[sectionIndex][criteriaIndex] = {
      selectedOption,
      points,
    };

    set({ responses: newResponses });
  },

  calculateScores: () => {
    const state = get();

    let totalScore = 0;
    const sectionScores: SectionScore[] = [];

    quizData.forEach((section: Section, sectionIndex: number) => {
      let sectionScore = 0;

      if (state.responses[sectionIndex]) {
        section.criteria.forEach(
          (criteria: Criteria, criteriaIndex: number) => {
            const response = state.responses[sectionIndex][criteriaIndex];
            if (response) {
              sectionScore += response.points;
            }
          },
        );
      }

      sectionScores.push({
        section: section.section,
        score: sectionScore,
        totalPoints: section.totalPoints,
      });

      totalScore += sectionScore;
    });

    set({ totalScore, sectionScores });
  },

  completeQuiz: () => {
    const { calculateScores } = get();
    calculateScores();
    set({ isCompleted: true });
  },

  resetQuiz: () =>
    set({
      userInfo: null,
      currentSection: 0,
      currentCriteria: 0,
      responses: {},
      isCompleted: false,
      totalScore: 0,
      sectionScores: [],
    }),

  getProgress: () => {
    const state = get();
    const totalQuestions = state.getTotalQuestions();
    const currentQuestionNumber = state.getCurrentQuestionNumber();
    return (currentQuestionNumber / totalQuestions) * 100;
  },

  getTotalQuestions: () => {
    return quizData.reduce(
      (total: number, section: Section) => total + section.criteria.length,
      0,
    );
  },

  getCurrentQuestionNumber: () => {
    const state = get();

    let questionNumber = 0;

    // Add all questions from previous sections
    for (let i = 0; i < state.currentSection; i++) {
      questionNumber += quizData[i].criteria.length;
    }

    // Add current criteria number (+ 1 because it's 0-indexed)
    questionNumber += state.currentCriteria + 1;

    return questionNumber;
  },
}));
