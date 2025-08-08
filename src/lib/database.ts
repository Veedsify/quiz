import { createClient } from "@libsql/client";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

export interface QuizResponse {
  id?: string | number;
  name: string;
  email: string;
  responses: string; // JSON string of responses
  totalScore: number;
  sectionScores: string; // JSON string of section scores
  completedAt: string;
}

export interface ResponseData {
  [sectionIndex: number]: {
    [criteriaIndex: number]: {
      selectedOption: string;
      points: number;
    };
  };
}

export interface SectionScore {
  section: string;
  score: number;
  totalPoints: number;
}

// @typescript-eslint/no-explicit-any
let db: ReturnType<typeof createClient> | Database | null = null;

export async function getDatabase() {
  if (db) return db;

  // Check if Turso environment variables are available
  if (
    process.env.NEXT_PUBLIC_TURSO_DATABASE_URL &&
    process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN
  ) {
    try {
      // Initialize Turso client
      db = createClient({
        url: process.env.NEXT_PUBLIC_TURSO_DATABASE_URL,
        authToken: process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN,
      });

      // Test connection and create table if it doesn't exist
      await db.execute(`
        CREATE TABLE IF NOT EXISTS quiz_responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          responses TEXT NOT NULL,
          total_score INTEGER NOT NULL,
          section_scores TEXT NOT NULL,
          completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log("Connected to Turso database");
      return db;
    } catch (error) {
      console.error(
        "Failed to connect to Turso database, falling back to SQLite:",
        error,
      );
    }
  }

  // Fallback to SQLite for development
  try {
    const dbPath = path.join(process.cwd(), "quiz.db");

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS quiz_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        responses TEXT NOT NULL,
        total_score INTEGER NOT NULL,
        section_scores TEXT NOT NULL,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Connected to SQLite database");
    return db;
  } catch (error) {
    console.error("Failed to connect to SQLite database:", error);
    throw new Error(`Database connection failed: ${error}`);
  }
}

export async function saveQuizResponse(response: Omit<QuizResponse, "id">) {
  try {
    const db = await getDatabase();

    // Check if this is a Turso client or SQLite
    if ("execute" in db && typeof db.execute === "function") {
      // Turso client
      const result = await db.execute({
        sql: `
          INSERT INTO quiz_responses (name, email, responses, total_score, section_scores, completed_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          response.name,
          response.email,
          response.responses,
          response.totalScore,
          response.sectionScores,
          response.completedAt,
        ],
      });
      return result.lastInsertRowid ? result.lastInsertRowid.toString() : "0";
    } else {
      // SQLite client
      const result = await (db as Database).run(
        `INSERT INTO quiz_responses (name, email, responses, total_score, section_scores, completed_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          response.name,
          response.email,
          response.responses,
          response.totalScore,
          response.sectionScores,
          response.completedAt,
        ],
      );
      return result.lastID ? result.lastID.toString() : "0";
    }
  } catch (error) {
    console.error("Failed to save quiz response:", error);
    throw new Error(`Failed to save quiz response: ${error}`);
  }
}

export async function getAllQuizResponses(): Promise<QuizResponse[]> {
  try {
    const db = await getDatabase();

    // Check if this is a Turso client or SQLite
    if ("execute" in db && typeof db.execute === "function") {
      // Turso client
      const result = await db.execute(`
        SELECT
          id,
          name,
          email,
          responses,
          total_score as totalScore,
          section_scores as sectionScores,
          completed_at as completedAt
        FROM quiz_responses
        ORDER BY completed_at DESC
      `);

      return result.rows.map((row: Record<string, unknown>) => ({
        id: row.id as number,
        name: row.name as string,
        email: row.email as string,
        responses: row.responses as string,
        totalScore: row.totalScore as number,
        sectionScores: row.sectionScores as string,
        completedAt: row.completedAt as string,
      }));
    } else {
      // SQLite client
      const rows = await (db as Database).all(`
        SELECT
          id,
          name,
          email,
          responses,
          total_score as totalScore,
          section_scores as sectionScores,
          completed_at as completedAt
        FROM quiz_responses
        ORDER BY completed_at DESC
      `);

      return rows;
    }
  } catch (error) {
    console.error("Failed to get quiz responses:", error);
    throw new Error(`Failed to get quiz responses: ${error}`);
  }
}

export async function getQuizResponseById(
  id: number,
): Promise<QuizResponse | null> {
  try {
    const db = await getDatabase();

    // Check if this is a Turso client or SQLite
    if ("execute" in db && typeof db.execute === "function") {
      // Turso client
      const result = await db.execute({
        sql: `
          SELECT
            id,
            name,
            email,
            responses,
            total_score as totalScore,
            section_scores as sectionScores,
            completed_at as completedAt
          FROM quiz_responses
          WHERE id = ?
        `,
        args: [id],
      });

      if (result.rows.length === 0) return null;

      const row = result.rows[0] as Record<string, unknown>;
      return {
        id: row.id as number,
        name: row.name as string,
        email: row.email as string,
        responses: row.responses as string,
        totalScore: row.totalScore as number,
        sectionScores: row.sectionScores as string,
        completedAt: row.completedAt as string,
      };
    } else {
      // SQLite client
      const row = await (db as Database).get(
        `
        SELECT
          id,
          name,
          email,
          responses,
          total_score as totalScore,
          section_scores as sectionScores,
          completed_at as completedAt
        FROM quiz_responses
        WHERE id = ?
      `,
        [id],
      );

      return row || null;
    }
  } catch (error) {
    console.error("Failed to get quiz response by ID:", error);
    throw new Error(`Failed to get quiz response by ID: ${error}`);
  }
}

export async function deleteQuizResponse(
  id: string | number,
): Promise<boolean> {
  try {
    const db = await getDatabase();

    // Check if this is a Turso client or SQLite
    if ("execute" in db && typeof db.execute === "function") {
      // Turso client
      const result = await db.execute({
        sql: "DELETE FROM quiz_responses WHERE id = ?",
        args: [id],
      });
      return result.rowsAffected > 0;
    } else {
      // SQLite client
      const result = await (db as Database).run(
        "DELETE FROM quiz_responses WHERE id = ?",
        [id],
      );
      return (result.changes || 0) > 0;
    }
  } catch (error) {
    console.error("Failed to delete quiz response:", error);
    throw new Error(`Failed to delete quiz response: ${error}`);
  }
}

export async function createDummyRecord() {
  try {
    // Helper function to get random element from array
    const getRandomElement = <T>(arr: T[]): T =>
      arr[Math.floor(Math.random() * arr.length)];

    // Helper function to get random number between min and max (inclusive)
    const getRandomNumber = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    // Random options for different fields
    const yesNoOptions = ["Yes", "No"];
    const destinations = [
      "Thailand, Vietnam, Cambodia for backpacking trip",
      "India for spiritual journey",
      "Kenya and Tanzania for safari",
      "Peru for hiking Machu Picchu",
      "Morocco and Egypt for cultural tour",
    ];
    const durations = [
      "2 weeks in Thailand, 1 week in Vietnam, 1 week in Cambodia",
      "3 weeks throughout India",
      "10 days Kenya, 1 week Tanzania",
      "2 weeks in Peru mountains",
      "1 week Morocco, 1 week Egypt",
    ];
    const purposes = ["Leisure", "Business", "Education", "Volunteer work"];
    const companions = ["Alone", "With others"];
    const relationships = ["Family", "Friends", "Colleagues", "Partner"];
    const accommodations = ["Hotel", "Hostel", "Camping", "Local family"];
    const environments = ["Urban only", "Rural only", "Both urban and rural"];
    const qualityOptions = ["Excellent", "Good", "Fair", "Poor"];
    const consistencyOptions = [
      "Consistently",
      "Usually",
      "Sometimes",
      "Rarely",
    ];
    const discussionOptions = [
      "Discussed thoroughly",
      "Discussed",
      "Mentioned briefly",
      "Not discussed",
    ];
    const provisionOptions = ["Provided", "Partially provided", "Not provided"];
    const completionOptions = [
      "Completed",
      "Partially completed",
      "Not completed",
    ];

    // Generate random responses with random points
    const dummyResponses = {
      0: {
        // Introduction section
        0: {
          selectedOption: getRandomElement(yesNoOptions),
          points: getRandomNumber(0, 5),
        },
        1: {
          selectedOption: getRandomElement(yesNoOptions),
          points: getRandomNumber(0, 5),
        },
      },
      1: {
        // History Taking section
        0: {
          selectedOption: getRandomElement(destinations),
          points: getRandomNumber(0, 2),
        },
        1: {
          selectedOption: getRandomElement(durations),
          points: getRandomNumber(0, 2),
        },
        2: {
          selectedOption: `${getRandomElement(["March", "April", "May", "June"])} ${getRandomNumber(1, 28)}, 2024`,
          points: getRandomNumber(0, 1),
        },
        3: {
          selectedOption: `${getRandomElement(["May", "June", "July", "August"])} ${getRandomNumber(1, 28)}, 2024`,
          points: getRandomNumber(0, 1),
        },
        4: {
          selectedOption: getRandomElement(purposes),
          points: getRandomNumber(0, 1),
        },
        5: {
          selectedOption: getRandomElement(companions),
          points: getRandomNumber(0, 1),
        },
        6: {
          selectedOption: getRandomElement(relationships),
          points: getRandomNumber(0, 1),
        },
        7: {
          selectedOption: getRandomElement(accommodations),
          points: getRandomNumber(0, 1),
        },
        8: {
          selectedOption: getRandomElement(environments),
          points: getRandomNumber(0, 1),
        },
        9: {
          selectedOption: getRandomElement([
            "Yes, went to Japan and South Korea last year",
            "No, this is my first international trip",
            "Yes, traveled to Europe multiple times",
          ]),
          points: getRandomNumber(0, 1),
        },
        10: {
          selectedOption: getRandomElement([
            "No previous travel-related health issues",
            "Had food poisoning in Mexico",
            "Motion sickness on flights",
          ]),
          points: getRandomNumber(0, 1),
        },
        11: {
          selectedOption: getRandomElement([
            "Hepatitis A/B (2023), Typhoid (2023), Routine vaccines up to date",
            "Only routine vaccines, no travel-specific ones",
            "All vaccines current including yellow fever",
          ]),
          points: getRandomNumber(0, 1),
        },
        12: {
          selectedOption: getRandomElement([
            "No chronic conditions, no known allergies",
            "Diabetes, well controlled",
            "Asthma, uses inhaler",
          ]),
          points: getRandomNumber(0, 2),
        },
        13: {
          selectedOption: getRandomElement([
            "Only birth control pills",
            "Blood pressure medication",
            "No medications",
          ]),
          points: getRandomNumber(0, 2),
        },
        14: {
          selectedOption: getRandomElement([
            "Will drink bottled water, eat at busy restaurants, avoid street food",
            "Open to trying local food and drinks",
            "Very cautious about food and water",
          ]),
          points: getRandomNumber(0, 1),
        },
        15: {
          selectedOption: getRandomElement([
            "Very familiar",
            "Somewhat familiar",
            "Not familiar",
          ]),
          points: getRandomNumber(0, 1),
        },
        16: {
          selectedOption: getRandomElement([
            "No immediate travel plans after return",
            "Planning another trip in 6 months",
            "Work travel to Europe next month",
          ]),
          points: getRandomNumber(0, 1),
        },
        17: {
          selectedOption: getRandomElement([
            "Very aware",
            "Somewhat aware",
            "Not aware",
          ]),
          points: getRandomNumber(0, 1),
        },
      },
      2: {
        // Risk Assessment section
        0: {
          selectedOption: getRandomElement([
            "Malaria risk in rural areas, dengue fever, traveler's diarrhea, heat exhaustion",
            "Altitude sickness, food poisoning, sun exposure",
            "Infectious diseases, accidents, theft",
          ]),
          points: getRandomNumber(0, 4),
        },
        1: {
          selectedOption: getRandomElement([
            "Researched hospital locations in major cities, purchased travel insurance",
            "Basic travel insurance only",
            "No specific preparations made",
          ]),
          points: getRandomNumber(0, 4),
        },
        2: {
          selectedOption: getRandomElement([
            "Hiking, swimming, scuba diving, temple visits, street markets",
            "City tours, museums, restaurants",
            "Adventure sports, wildlife viewing",
          ]),
          points: getRandomNumber(0, 2),
        },
        3: {
          selectedOption: getRandomElement(yesNoOptions),
          points: getRandomNumber(0, 10),
        },
      },
      3: {
        // Health Advice section
        0: {
          selectedOption: getRandomElement(provisionOptions),
          points: getRandomNumber(0, 4),
        },
        1: {
          selectedOption: getRandomElement(discussionOptions),
          points: getRandomNumber(0, 4),
        },
        2: {
          selectedOption: getRandomElement(discussionOptions),
          points: getRandomNumber(0, 4),
        },
        3: {
          selectedOption: getRandomElement(discussionOptions),
          points: getRandomNumber(0, 4),
        },
        4: {
          selectedOption: getRandomElement(discussionOptions),
          points: getRandomNumber(0, 4),
        },
      },
      4: {
        // Documentation section
        0: {
          selectedOption: getRandomElement(completionOptions),
          points: getRandomNumber(0, 5),
        },
        1: {
          selectedOption: getRandomElement(provisionOptions),
          points: getRandomNumber(0, 5),
        },
      },
      5: {
        // Communication Skills section
        0: {
          selectedOption: getRandomElement(qualityOptions),
          points: getRandomNumber(0, 5),
        },
        1: {
          selectedOption: getRandomElement(consistencyOptions),
          points: getRandomNumber(0, 5),
        },
      },
      6: {
        // Professionalism section
        0: {
          selectedOption: getRandomElement(qualityOptions),
          points: getRandomNumber(0, 5),
        },
        1: {
          selectedOption: getRandomElement(consistencyOptions),
          points: getRandomNumber(0, 5),
        },
      },
    };

    // Calculate section scores based on random responses
    const calculateSectionScore = (sectionResponses: { [key: number]: { selectedOption: string; points: number } }) => {
      return Object.values(sectionResponses).reduce(
        (sum: number, response: { selectedOption: string; points: number }) => sum + response.points,
        0,
      );
    };

    const dummySectionScores = [
      {
        section: "Introduction",
        score: calculateSectionScore(dummyResponses[0]),
        totalPoints: 10,
      },
      {
        section: "History Taking",
        score: calculateSectionScore(dummyResponses[1]),
        totalPoints: 20,
      },
      {
        section: "Risk Assessment",
        score: calculateSectionScore(dummyResponses[2]),
        totalPoints: 20,
      },
      {
        section: "Health Advice",
        score: calculateSectionScore(dummyResponses[3]),
        totalPoints: 20,
      },
      {
        section: "Documentation",
        score: calculateSectionScore(dummyResponses[4]),
        totalPoints: 10,
      },
      {
        section: "Communication Skills",
        score: calculateSectionScore(dummyResponses[5]),
        totalPoints: 10,
      },
      {
        section: "Professionalism",
        score: calculateSectionScore(dummyResponses[6]),
        totalPoints: 10,
      },
    ];

    // Calculate total score
    const totalScore = dummySectionScores.reduce(
      (sum, section) => sum + section.score,
      0,
    );

    // Generate random user data
    const randomNames = [
      "Alice Johnson",
      "Bob Smith",
      "Carol Davis",
      "David Wilson",
      "Emma Brown",
      "Frank Miller",
    ];
    const randomEmails = [
      "alice@example.com",
      "bob@test.com",
      "carol@demo.org",
      "david@sample.net",
      "emma@random.co",
      "frank@temp.io",
    ];

    const dummyRecord = {
      name: getRandomElement(randomNames),
      email: getRandomElement(randomEmails),
      responses: JSON.stringify(dummyResponses),
      totalScore: totalScore,
      sectionScores: JSON.stringify(dummySectionScores),
      completedAt: new Date().toISOString(),
    };

    const responseId = await saveQuizResponse(dummyRecord);
    console.log("Dummy record created with ID:", responseId);
    return responseId;
  } catch (error) {
    console.error("Failed to create dummy record:", error);
    throw error;
  }
}
