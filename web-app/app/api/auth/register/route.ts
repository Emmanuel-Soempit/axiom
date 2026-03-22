import { NextResponse } from "next/server";
import { ApiResponse, User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Call Go Backend
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body, role: "client" }),
    });

    const result: ApiResponse<User> = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message || "Registration failed" },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Register Proxy Error:", error, API_URL);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
