export interface Criteria {
  description: string;
  points: number;
  inputType: "binary" | "multiple" | "shortText" | "longText";
  options?: string[]; // Only for binary and multiple choice
  placeholder?: string; // For text inputs
}

export interface Section {
  section: string;
  totalPoints: number;
  criteria: Criteria[];
}

export const quizData: Section[] = [
  {
    section: "Introduction",
    totalPoints: 10,
    criteria: [
      {
        description: "Introduces self",
        points: 5,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Confirms the traveller's identity",
        points: 5,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    section: "History Taking",
    totalPoints: 20,
    criteria: [
      {
        description: "What are your planned destinations?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "How long will you be staying at each location?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "When do you plan to depart?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "When do you plan to return?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description:
          "What is the purpose of your travel (e.g., leisure, business, volunteer work, Visiting friends and relatives)",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Will you be travelling alone or with others?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description:
          "If with others, who are they (e.g., family, friends, colleagues)?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Where will you be staying (e.g., hotel, hostel, rental)?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Will you be staying in urban or rural areas?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description:
          "Have you travelled internationally in the past year? If so, where?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description:
          "Have you had any health issues related to previous travels?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "What vaccinations have you received, and when?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description:
          "Do you have any pre-existing health conditions or allergies?",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Are you on any medications",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description:
          "How do you plan to manage food and water safety during your travels?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Are you familiar with the local food and water sources?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description:
          "Do you have any plans for activities or travel after returning home?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description:
          "Are you aware of any health monitoring you may need after returning?",
        points: 1,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    section: "Risk Assessment",
    totalPoints: 20,
    criteria: [
      {
        description:
          "Are you aware of any health risks associated with your destinations?",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description:
          "Have you researched the availability of healthcare in your travel locations?",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description:
          "What activities do you plan to engage in during your trip (e.g., hiking, swimming, cultural events)?",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Consults a travel risk source either Travax, CDC or WHO",
        points: 10,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    section: "Health Advice",
    totalPoints: 20,
    criteria: [
      {
        description: "Immunizations (Vaccination recommendations)",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Insurance",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Ingestion (Discusses food and water safety)",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Bite prevention if applicable",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Indiscretion",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    section: "Documentation",
    totalPoints: 10,
    criteria: [
      {
        description:
          "Completes necessary documentation (e.g., vaccination records). Provides written information to the traveller.",
        points: 10,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    section: "Communication Skills",
    totalPoints: 10,
    criteria: [
      {
        description:
          "Demonstrates effective communication (clear, empathetic, and culturally sensitive). Encourages questions and provides clarifications.",
        points: 10,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    section: "Professionalism",
    totalPoints: 10,
    criteria: [
      {
        description:
          "Maintains professionalism throughout the assessment. Respects confidentiality and exhibits ethical behaviour.",
        points: 10,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
];

export const getTotalPossibleScore = (): number => {
  return quizData.reduce((total, section) => total + section.totalPoints, 0);
};
