import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { getDB } from "../../lib/db";

// 🔹 Ambil semua template
export async function GET() {
  try {
    const db = await getDB();
    const [rows] = await db.query("SELECT * FROM templates ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/templates error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔹 Tambah template baru
export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const image = formData.get("image");

    let imagePath = null;

    // simpan file ke /public/uploads
    if (image && image.name) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const db = await getDB();
    await db.query(
      "INSERT INTO templates (name, description, image) VALUES (?, ?, ?)",
      [name, description, imagePath]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/templates error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
