import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${process.env.INTERNAL_API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message || "Invalid credentials" },
        { status: response.status }
      );
    }

    const res = NextResponse.json({
      success: true,
      user: result.data.user,
    });

    // ✅ Attach cookies to response directly
    res.cookies.set("session-token", result.data.token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.cookies.set("session-user", JSON.stringify(result.data.user), {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res;

  } catch (error) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}