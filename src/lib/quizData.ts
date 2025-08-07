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
        inputType: "longText",
        placeholder: "List all planned destinations...",
      },
      {
        description: "How long will you be staying at each location?",
        points: 1,
        inputType: "longText",
        placeholder: "Specify duration for each location...",
      },
      {
        description: "When do you plan to depart?",
        points: 1,
        inputType: "shortText",
        placeholder: "Enter departure date...",
      },
      {
        description: "When do you plan to return?",
        points: 1,
        inputType: "shortText",
        placeholder: "Enter return date...",
      },
      {
        description: "What is the purpose of your travel?",
        points: 1,
        inputType: "multiple",
        options: [
          "Leisure",
          "Business",
          "Volunteer work",
          "Visiting friends and relatives",
          "Medical tourism",
          "Education/Conference",
          "Other",
        ],
      },
      {
        description: "Will you be travelling alone or with others?",
        points: 1,
        inputType: "binary",
        options: ["Alone", "With others"],
      },
      {
        description: "If with others, who are they?",
        points: 1,
        inputType: "multiple",
        options: [
          "Family",
          "Friends",
          "Colleagues",
          "Tour group",
          "Not applicable",
        ],
      },
      {
        description: "Where will you be staying?",
        points: 1,
        inputType: "multiple",
        options: [
          "Hotel",
          "Hostel",
          "Rental property",
          "With friends/family",
          "Camping",
          "Other",
        ],
      },
      {
        description: "Will you be staying in urban or rural areas?",
        points: 1,
        inputType: "multiple",
        options: ["Urban only", "Rural only", "Both urban and rural", "Unsure"],
      },
      {
        description:
          "Have you travelled internationally in the past year? If so, where?",
        points: 1,
        inputType: "longText",
        placeholder:
          "List countries visited in the past year or write 'No' if none...",
      },
      {
        description:
          "Have you had any health issues related to previous travels?",
        points: 1,
        inputType: "longText",
        placeholder:
          "Describe any travel-related health issues or write 'None'...",
      },
      {
        description: "What vaccinations have you received, and when?",
        points: 1,
        inputType: "longText",
        placeholder: "List all vaccinations with approximate dates...",
      },
      {
        description:
          "Do you have any pre-existing health conditions or allergies?",
        points: 2,
        inputType: "longText",
        placeholder:
          "List any medical conditions, allergies, or write 'None'...",
      },
      {
        description: "Are you on any medications?",
        points: 2,
        inputType: "longText",
        placeholder: "List all current medications or write 'None'...",
      },
      {
        description:
          "How do you plan to manage food and water safety during your travels?",
        points: 1,
        inputType: "longText",
        placeholder: "Describe your food and water safety precautions...",
      },
      {
        description: "Are you familiar with the local food and water sources?",
        points: 1,
        inputType: "multiple",
        options: [
          "Very familiar",
          "Somewhat familiar",
          "Not familiar",
          "Unsure",
        ],
      },
      {
        description:
          "Do you have any plans for activities or travel after returning home?",
        points: 1,
        inputType: "longText",
        placeholder: "Describe any post-travel plans or write 'None'...",
      },
      {
        description:
          "Are you aware of any health monitoring you may need after returning?",
        points: 1,
        inputType: "multiple",
        options: ["Yes, fully aware", "Somewhat aware", "Not aware", "Unsure"],
      },
    ],
  },
  {
    section: "Risk Assessment",
    totalPoints: 20,
    criteria: [
      {
        description: "Identifies health risks based on travel destination",
        points: 4,
        inputType: "longText",
        placeholder:
          "List and describe health risks associated with your destinations...",
      },
      {
        description:
          "Assesses exposure to infectious diseases (e.g., malaria, dengue)",
        points: 4,
        inputType: "longText",
        placeholder:
          "Describe potential exposure to infectious diseases and prevention measures...",
      },
      {
        description:
          "What activities do you plan to engage in during your trip?",
        points: 2,
        inputType: "longText",
        placeholder:
          "List planned activities (hiking, swimming, cultural events, etc.)...",
      },
      {
        description: "Consults a travel risk source (e.g., Travax, CDC, WHO)",
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
        description: "Immunizations (vaccination recommendations)",
        points: 4,
        inputType: "binary",
        options: ["Provided", "Not provided"],
      },
      {
        description: "Insurance",
        points: 4,
        inputType: "binary",
        options: ["Discussed", "Not discussed"],
      },
      {
        description: "Discusses food and water safety",
        points: 4,
        inputType: "binary",
        options: ["Discussed", "Not discussed"],
      },
      {
        description: "Bite prevention (if applicable)",
        points: 4,
        inputType: "multiple",
        options: [
          "Discussed thoroughly",
          "Discussed briefly",
          "Not discussed",
          "Not applicable",
        ],
      },
      {
        description: "Indiscretion",
        points: 4,
        inputType: "binary",
        options: ["Discussed", "Not discussed"],
      },
    ],
  },
  {
    section: "Documentation",
    totalPoints: 10,
    criteria: [
      {
        description:
          "Completes necessary documentation (e.g., vaccination records)",
        points: 5,
        inputType: "binary",
        options: ["Completed", "Not completed"],
      },
      {
        description: "Provides written information to the traveller",
        points: 5,
        inputType: "binary",
        options: ["Provided", "Not provided"],
      },
    ],
  },
  {
    section: "Communication Skills",
    totalPoints: 10,
    criteria: [
      {
        description:
          "Demonstrates effective communication (clear, empathetic, and culturally sensitive)",
        points: 5,
        inputType: "multiple",
        options: ["Excellent", "Good", "Fair", "Poor"],
      },
      {
        description: "Encourages questions and provides clarifications",
        points: 5,
        inputType: "multiple",
        options: ["Consistently", "Sometimes", "Rarely", "Never"],
      },
    ],
  },
  {
    section: "Professionalism",
    totalPoints: 10,
    criteria: [
      {
        description: "Maintains professionalism throughout the assessment",
        points: 5,
        inputType: "multiple",
        options: ["Excellent", "Good", "Fair", "Poor"],
      },
      {
        description: "Respects confidentiality and exhibits ethical behaviour",
        points: 5,
        inputType: "multiple",
        options: ["Consistently", "Mostly", "Sometimes", "Rarely"],
      },
    ],
  },
];

export const getTotalPossibleScore = (): number => {
  return quizData.reduce((total, section) => total + section.totalPoints, 0);
};
