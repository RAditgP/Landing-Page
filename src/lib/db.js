// src/lib/db.js
import mysql from "mysql2/promise";

let connection;

/**
 * Koneksi database tunggal untuk mencegah duplikasi
 * (Next.js sering reload modul di mode development)
 */
export async function getDB() {
  if (!global._dbConnection) {
    global._dbConnection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "landing_page_db", // sesuaikan dengan database kamu
    });
  }

  return global._dbConnection;
}
