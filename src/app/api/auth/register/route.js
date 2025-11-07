import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email & password required" }, { status: 400 });
    }

    const db = await getDB();

    // cek email sudah ada
    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    console.log("Hashed password:", hashed); // 👈 tambahkan ini untuk cek hasil bcrypt

    await db.query(
      "INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
      [email, name || null, hashed]
    );

    return NextResponse.json({ message: "Registered" }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err); // 👈 log detail ke terminal
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}