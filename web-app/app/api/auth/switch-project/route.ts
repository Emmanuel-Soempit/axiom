import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SwitchProjectResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("session-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Call Go Backend
    const response = await fetch(`${API_URL}/api/v1/auth/switch-project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result: SwitchProjectResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: result?.error || "Failed to switch project" },
        { status: response.status },
      );
    }

    // Update JWT token cookie
    cookieStore.set("session-token", result.data.token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Update User data cookie
    cookieStore.set("session-user", JSON.stringify(result.data.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      user: result.data.user,
    });
  } catch (error) {
    console.error("Switch Project Proxy Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
