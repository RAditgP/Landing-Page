import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import { getDB } from "../../lib/db";

<<<<<<< HEAD
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
=======
//===================================================================
// METHOD GET: Mengambil daftar semua template
//===================================================================
export async function GET() {
 try {
const db = await getDB();
// PERBAIKAN: Mengganti 'templates' menjadi 'template'
const [rows] = await db.query("SELECT * FROM template ORDER BY id DESC");
return Response.json(rows);
} catch (error) {
 console.error("❌ GET error:", error);
 return Response.json({ error: "Gagal mengambil data" }, { status: 500 });
}
}

//===================================================================
// METHOD POST: Menambahkan template baru
//===================================================================
export async function POST(req) {
 try {
const { name, description, image } = await req.json();
 const db = await getDB();

// PERBAIKAN: Mengganti 'templates' menjadi 'template'
await db.query(
 "INSERT INTO template (name, description, image) VALUES (?, ?, ?)",
[name, description, image]
 );

return Response.json({ message: "✅ Template berhasil ditambahkan!" });
} catch (error) {
console.error("❌ POST error:", error);
return Response.json({ error: "Gagal menambah template" }, { status: 500 });
}
}

//===================================================================
// METHOD PUT: Memperbarui template
//===================================================================
export async function PUT(req) {
 try {
 const { id, name, description, image } = await req.json();
const db = await getDB();

 // PERBAIKAN: Mengganti 'templates' menjadi 'template'
await db.query(
"UPDATE template SET name = ?, description = ?, image = ? WHERE id = ?",
 [name, description, image, id]
);

 return Response.json({ message: "✅ Template berhasil diperbarui!" });
} catch (error) {
console.error("❌ PUT error:", error);
return Response.json({ error: "Gagal memperbarui template" }, { status: 500 });
}
}

//===================================================================
// METHOD DELETE: Menghapus template
//===================================================================
export async function DELETE(req) {
 try {
const { id } = await req.json();
 const db = await getDB();

 // PERBAIKAN: Mengganti 'templates' menjadi 'template'
 await db.query("DELETE FROM template WHERE id = ?", [id]);
 return Response.json({ message: "✅ Template berhasil dihapus!" });
 } catch (error) {
 console.error("❌ DELETE error:", error);
 return Response.json({ error: "Gagal menghapus template" }, { status: 500 });
 }
}
>>>>>>> 7f892b34ba5c81e23fd4dd215ceaa4d60abc3dac
