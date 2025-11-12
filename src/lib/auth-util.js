// src/lib/auth-util.js
import { cookies } from 'next/headers';
import { getDB } from './db';

/**
 * Mendapatkan detail pengguna yang sedang login berdasarkan token sesi yang ada di cookie.
 * @returns {Promise<object | null>} Objek pengguna atau null jika sesi tidak valid.
 */
export async function getCurrentUser() {
  // ✅ Ambil cookies secara async
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return null; // Tidak ada token
  }

  try {
    const db = await getDB();

    // ✅ Cek sesi yang valid
    const [sessionRows] = await db.query(
      'SELECT user_id FROM sessions WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    if (sessionRows.length === 0) {
      return null; // Sesi tidak valid
    }

    const userId = sessionRows[0].user_id;

    // ✅ Ambil data user
    const [userRows] = await db.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [userId]
    );

    return userRows.length > 0 ? userRows[0] : null;
  } catch (error) {
    console.error('❌ Error fetching current user:', error);
    return null;
  }
}
