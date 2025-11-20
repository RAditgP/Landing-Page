import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDB();

    // 5 template terbaru
    const [templates] = await db.query(
      "SELECT id, name, category, createdAt FROM template ORDER BY createdAt DESC LIMIT 5"
    );

    // 5 pesan terbaru
    const [messages] = await db.query(
      "SELECT id, namaLengkap AS name, pesanAnda AS message, dikirimPada AS createdAt FROM pesankontak ORDER BY dikirimPada DESC LIMIT 5"
    );

    // Trend user (7 hari terakhir) — sudah dibenerin ke WIB
    const [trendRows] = await db.query(`
      SELECT 
        DATE(CONVERT_TZ(createdAt, '+00:00', '+07:00')) AS date, 
        COUNT(*) AS count
      FROM users
      WHERE createdAt IS NOT NULL
      AND CONVERT_TZ(createdAt, '+00:00', '+07:00') >= DATE_SUB(CONVERT_TZ(NOW(), '+00:00', '+07:00'), INTERVAL 6 DAY)
      GROUP BY DATE(CONVERT_TZ(createdAt, '+00:00', '+07:00'))
      ORDER BY DATE(CONVERT_TZ(createdAt, '+00:00', '+07:00'))
    `);

    // Normalisasi ke format grafik
    const trendMap = {};
    trendRows.forEach(r => {
      const iso = r.date.toISOString().slice(0, 10); // yyyy-mm-dd
      trendMap[iso] = r.count;
    });

    // Buat daftar 7 hari terakhir
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      // NORMALISASI WIB
      const wib = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));

      const iso = wib.toISOString().slice(0, 10);
      trend.push({ date: iso, count: trendMap[iso] || 0 });
    }

    return NextResponse.json({ templates, messages, trend });
  } catch (err) {
    console.error("❌ Error GET /api/admin/activity:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
