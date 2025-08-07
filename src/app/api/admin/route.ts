import { NextRequest, NextResponse } from "next/server";
import {
  getAllQuizResponses,
  getQuizResponseById,
  deleteQuizResponse,
} from "@/lib/database";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, action, id } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    if (action === "getAll") {
      const responses = await getAllQuizResponses();
      return NextResponse.json({
        success: true,
        data: responses,
      });
    }

    if (action === "getById" && id) {
      const response = await getQuizResponseById(parseInt(id));
      if (!response) {
        return NextResponse.json(
          { error: "Response not found" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        data: response,
      });
    }

    if (action === "delete" && id) {
      const deleted = await deleteQuizResponse(id);
      if (!deleted) {
        return NextResponse.json(
          { error: "Response not found or could not be deleted" },
          { status: 404 },
        );
      }
      return NextResponse.json({
        success: true,
        message: "Response deleted successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in admin API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
