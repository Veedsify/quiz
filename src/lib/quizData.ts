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
    section: "Introduction & Professionalism",
    totalPoints: 15,
    criteria: [
      {
        description: "Doctor introduces themselves professionally",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Confirms the patient's identity appropriately",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Explains the purpose of the consultation clearly",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Maintains appropriate eye contact and body language",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Shows empathy and cultural sensitivity",
        points: 3,
        inputType: "multiple",
        options: ["Excellent", "Good", "Fair", "Poor"],
      },
    ],
  },
  {
    section: "Travel History Taking",
    totalPoints: 25,
    criteria: [
      {
        description: "Asks about planned travel destinations",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Inquires about duration of stay at each location",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Asks about departure and return dates",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Determines the purpose of travel",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Asks about travel companions",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Inquires about accommodation type and location",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Asks about urban vs rural areas to be visited",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Inquires about previous international travel",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Asks about previous travel-related health issues",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Reviews current vaccination status",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    section: "Medical History Assessment",
    totalPoints: 20,
    criteria: [
      {
        description: "Reviews pre-existing medical conditions",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Asks about current medications",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Inquires about allergies and adverse reactions",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Asks about pregnancy status (if applicable)",
        points: 3,
        inputType: "multiple",
        options: ["Yes, asked", "Not applicable", "Forgot to ask"],
      },
      {
        description: "Reviews immunocompromised status",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Asks about previous adverse vaccine reactions",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    section: "Risk Assessment & Consultation",
    totalPoints: 25,
    criteria: [
      {
        description: "Identifies destination-specific health risks",
        points: 5,
        inputType: "multiple",
        options: ["Comprehensive", "Adequate", "Basic", "Inadequate"],
      },
      {
        description: "Assesses risk of vector-borne diseases",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Discusses food and water safety risks",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Consults reliable travel health resources",
        points: 5,
        inputType: "multiple",
        options: [
          "Used multiple sources",
          "Used one source",
          "Relied on memory",
          "No consultation",
        ],
      },
      {
        description: "Considers individual patient risk factors",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Discusses altitude-related risks (if applicable)",
        points: 3,
        inputType: "multiple",
        options: [
          "Discussed thoroughly",
          "Mentioned briefly",
          "Not applicable",
          "Not discussed",
        ],
      },
    ],
  },
  {
    section: "Preventive Advice & Recommendations",
    totalPoints: 30,
    criteria: [
      {
        description: "Provides appropriate vaccination recommendations",
        points: 6,
        inputType: "multiple",
        options: ["Comprehensive", "Adequate", "Basic", "Inadequate"],
      },
      {
        description: "Discusses travel insurance importance",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Explains food and water safety precautions",
        points: 4,
        inputType: "multiple",
        options: [
          "Detailed explanation",
          "Basic advice",
          "Brief mention",
          "Not discussed",
        ],
      },
      {
        description: "Provides insect bite prevention advice",
        points: 4,
        inputType: "multiple",
        options: ["Comprehensive", "Adequate", "Basic", "Not discussed"],
      },
      {
        description: "Discusses safe sexual practices",
        points: 3,
        inputType: "multiple",
        options: [
          "Discussed appropriately",
          "Mentioned briefly",
          "Not discussed",
          "Not applicable",
        ],
      },
      {
        description: "Advises on sun protection measures",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Provides malaria prophylaxis recommendations (if needed)",
        points: 4,
        inputType: "multiple",
        options: [
          "Appropriate prescription",
          "Discussed but not needed",
          "Inadequate advice",
          "Not discussed",
        ],
      },
      {
        description: "Discusses post-travel health monitoring",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Provides emergency contact information",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    section: "Documentation & Follow-up",
    totalPoints: 15,
    criteria: [
      {
        description: "Completes vaccination records accurately",
        points: 4,
        inputType: "multiple",
        options: [
          "Complete and accurate",
          "Mostly complete",
          "Basic documentation",
          "Inadequate",
        ],
      },
      {
        description: "Provides written travel health information",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Documents consultation notes appropriately",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Arranges appropriate follow-up if needed",
        points: 2,
        inputType: "multiple",
        options: [
          "Arranged when needed",
          "Not needed",
          "Should have arranged",
          "Unclear",
        ],
      },
      {
        description: "Provides clear instructions for medication use",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
  {
    section: "Communication & Patient Education",
    totalPoints: 20,
    criteria: [
      {
        description: "Uses clear, understandable language",
        points: 4,
        inputType: "multiple",
        options: ["Excellent", "Good", "Fair", "Poor"],
      },
      {
        description: "Encourages questions and provides clarifications",
        points: 4,
        inputType: "multiple",
        options: [
          "Actively encouraged",
          "Responded well",
          "Minimal encouragement",
          "Discouraged questions",
        ],
      },
      {
        description: "Checks patient understanding throughout consultation",
        points: 4,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Demonstrates cultural sensitivity",
        points: 3,
        inputType: "multiple",
        options: ["Excellent", "Good", "Fair", "Poor"],
      },
      {
        description: "Addresses patient concerns appropriately",
        points: 3,
        inputType: "binary",
        options: ["Yes", "No"],
      },
      {
        description: "Maintains confidentiality and privacy",
        points: 2,
        inputType: "binary",
        options: ["Yes", "No"],
      },
    ],
  },
];

export const getTotalPossibleScore = (): number => {
  return quizData.reduce((total, section) => total + section.totalPoints, 0);
};
