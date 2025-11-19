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

    // Trend user (7 hari terakhir)
    const [trendRows] = await db.query(`
      SELECT DATE(createdAt) as date, COUNT(*) as count
      FROM users
      WHERE createdAt IS NOT NULL
      AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(createdAt)
      ORDER BY DATE(createdAt)
    `);

    // Normalisasi menjadi format grafik
    const trendMap = {};
    trendRows.forEach(r => {
      const d = new Date(r.date);
      const iso = d.toISOString().slice(0, 10); // yyyy-mm-dd
      trendMap[iso] = r.count;
    });

    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      trend.push({ date: iso, count: trendMap[iso] || 0 });
    }

    return NextResponse.json({ templates, messages, trend });
  } catch (err) {
    console.error("❌ Error GET /api/admin/activity:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
