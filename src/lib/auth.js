// src/lib/auth.js
import bcrypt from "bcryptjs"; // ⚠️ ganti ke bcryptjs agar 100% kompatibel di Next.js edge/serverless
import crypto from "crypto";
import { getDB } from "@/lib/db";

/**
 * Hash password pakai bcrypt
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * Verifikasi password user
 */
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Buat session login user
 */
export async function createSession(userId) {
  const db = await getDB();
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 hari
  const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 hari

  await db.query(
    "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expiresAt]
  );

  // login/route.js membutuhkan tiga data ini
  return { token, expiresAt, maxAgeSeconds };
}

/**
 * Ambil session dari token
 */
export async function getSession(token) {
  const db = await getDB();
  const [rows] = await db.query(
    `SELECT s.*, u.email, u.name 
     FROM sessions s 
     JOIN users u ON s.user_id = u.id 
     WHERE s.token = ? AND s.expires_at > NOW()`,
    [token]
  );
  return rows[0] || null;
}

/**
 * Logout (hapus session)
 */
export async function deleteSession(token) {
  const db = await getDB();
  await db.query("DELETE FROM sessions WHERE token = ?", [token]);
}
