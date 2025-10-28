// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";

export async function POST(req) {
  try {
    const cookie = req.cookies.get("session_token");
    const token = cookie?.value;
    if (token) {
      await deleteSession(token);
    }
    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.set({
      name: "session_token",
      value: "",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // delete immediately
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
