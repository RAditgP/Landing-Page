import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDB();
    const [[{ totalTemplates }]] = await db.query("SELECT COUNT(*) AS totalTemplates FROM template");
    const [[{ totalMessages }]] = await db.query("SELECT COUNT(*) AS totalMessages FROM pesankontak");
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");

    return NextResponse.json({
      templates: totalTemplates || 0,
      messages: totalMessages || 0,
      users: totalUsers || 0,
    });
  } catch (err) {
    console.error("❌ Error GET /api/admin/stats:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
