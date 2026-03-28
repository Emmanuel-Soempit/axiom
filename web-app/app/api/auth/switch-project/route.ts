import { NextResponse } from "next/server";
import { SwitchProjectResponse } from "@/types";
import { cookies } from "next/headers";

const API_URL = process.env.INTERNAL_API_URL;

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

    const res = NextResponse.json({
      success: true,
      message: result.message,
      user: result.data.user,
    });


    // Update JWT token cookie
    res.cookies.set("session-token", result.data.token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    // Update User data cookie
   res.cookies.set("session-user", JSON.stringify(result.data.user), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return res
  } catch (error) {
    console.error("Switch Project Proxy Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
