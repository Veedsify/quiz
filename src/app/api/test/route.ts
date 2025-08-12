import { createDummyRecord } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const responseId = await createDummyRecord();

    return NextResponse.json(
      {
        success: true,
        message: "Dummy record created successfully",
        id: responseId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating dummy record:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to create dummy record",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const responseId = await createDummyRecord();

    return NextResponse.json(
      {
        success: true,
        message: "Dummy record created successfully",
        id: responseId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating dummy record:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to create dummy record",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
