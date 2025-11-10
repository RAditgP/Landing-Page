// src/lib/db.js
import mysql from "mysql2/promise";

/**
 * Membuat koneksi database tunggal agar tidak duplikat
 */
export async function getDB() {
  if (!global._dbConnection) {
    global._dbConnection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "landing_page_db", // ganti sesuai nama database kamu
    });
    console.log("✅ Database connected successfully!");
  }
  return global._dbConnection;
}
