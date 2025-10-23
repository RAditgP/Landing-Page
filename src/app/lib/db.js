import mysql from "mysql2/promise";

let pool;

export async function getDB() {
  if (!pool) {
    pool = mysql.createPool({
      host: "localhost",
      user: "root", // sesuaikan
      password: "", // sesuaikan
      database: "landing_page_db",
    });
  }
  return pool;
}
