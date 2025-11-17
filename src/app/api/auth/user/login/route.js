// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { verifyPassword, createSession } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email & password required" }, { status: 400 });
    }

    const db = await getDB();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // create session in DB
    const { token, expiresAt, maxAgeSeconds } = await createSession(user.id);

    // set cookie
    const res = NextResponse.json({ message: "Login success", user: { id: user.id, email: user.email, name: user.name } });
    res.cookies.set({
      name: "session_token",
      value: token,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: maxAgeSeconds,
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
