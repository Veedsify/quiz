import { NextRequest, NextResponse } from "next/server";
import { saveQuizResponse } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, responses, totalScore, sectionScores } = body;

    if (!name || !responses || totalScore === undefined || !sectionScores) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate data types
    if (typeof name !== "string" || (email && typeof email !== "string")) {
      return NextResponse.json(
        { error: "Invalid data types" },
        { status: 400 },
      );
    }

    if (typeof totalScore !== "number" || totalScore < 0) {
      return NextResponse.json(
        { error: "Invalid total score" },
        { status: 400 },
      );
    }

    const quizResponse = {
      name: name.trim(),
      email: email ? email.trim() : "Not provided",
      responses: JSON.stringify(responses),
      totalScore,
      sectionScores: JSON.stringify(sectionScores),
      completedAt: new Date().toISOString(),
    };

    const responseId = await saveQuizResponse(quizResponse);

    return NextResponse.json(
      {
        success: true,
        message: "Quiz response saved successfully",
        id: responseId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving quiz response:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to save quiz response",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
