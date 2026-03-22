import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Call Go Backend
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result: AuthResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message || "Invalid credentials" },
        { status: response.status },
      );
    }

    const cookieStore = await cookies();

    // Store JWT token
    cookieStore.set("session-token", result.data.token, {
      httpOnly: false, // Changed to false so client-side Axios can read it
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Store User data
    cookieStore.set("session-user", JSON.stringify(result.data.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: result.data.user,
    });
  } catch (error) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
