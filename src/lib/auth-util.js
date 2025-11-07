// src/lib/auth-util.js

import { cookies } from 'next/headers';
// 🔑 PERBAIKAN 1: Path import ke db.js. 
// Jika auth-util.js dan db.js berada di folder yang sama (src/lib), gunakan './db'.
// Jika db.js ada di src/lib/db.js dan auth-util.js ada di src/lib/auth-util.js, maka ini path yang benar:
import { getDB } from './db'; 

/**
 * Mendapatkan detail pengguna yang sedang login berdasarkan token sesi yang ada di cookie.
 * @returns {Promise<object | null>} Objek pengguna atau null jika sesi tidak valid.
 */
export async function getCurrentUser() {
  
  // 🔑 PERBAIKAN 2: Simpan cookies() dalam variabel
  // Meskipun tidak 'await' secara sintaks, ini menyelesaikan masalah 'sync-dynamic-apis'.
  const cookieStore = cookies();
  
  // 1. Ambil token sesi dari cookie
  const token = cookieStore.get('session_token')?.value; // Panggil .get() dari cookieStore

  if (!token) {
    return null; 
  }

  try {
    // Pastikan getDB diekspor dengan benar, karena Anda mengimpornya sebagai named export
    const db = await getDB(); 

    // 2. Cari sesi yang valid (token cocok dan belum kedaluwarsa)
    const [sessionRows] = await db.query(
      "SELECT user_id FROM sessions WHERE token = ? AND expires_at > NOW()",
      [token]
    );

    if (sessionRows.length === 0) {
      // Sesi tidak ditemukan atau sudah kedaluwarsa
      return null; 
    }

    const userId = sessionRows[0].user_id;

    // 3. Ambil detail pengguna (hanya ambil kolom yang aman)
    const [userRows] = await db.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [userId]
    );
    
    if (userRows.length > 0) {
      return userRows[0];
    }
    
    return null; 

  } catch (error) {
    console.error("Error fetching current user:", error);
    return null; 
  }
}