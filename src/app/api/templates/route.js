import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import fs from "fs";
import path from "path";

// Lokasi folder upload gambar (pastikan folder ini ada)
const uploadDir = path.join(process.cwd(), "public", "uploads");

// Buat folder uploads jika belum ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ============================================================
// 📦 GET → Ambil semua template
// ============================================================
export async function GET() {
  try {
    const db = await getDB();
    const [rows] = await db.query("SELECT * FROM templates ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("🔥 ERROR GET /api/templates:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ============================================================
// ➕ POST → Tambah template baru
// ============================================================
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const category = formData.get("category");
    const description = formData.get("description");
    const tag = formData.get("tag");
    const demoUrl = formData.get("demoUrl");
    const useUrl = formData.get("useUrl");
    const image = formData.get("image");

    if (!name || !category || !description) {
      return NextResponse.json(
        { error: "Nama, kategori, dan deskripsi wajib diisi" },
        { status: 400 }
      );
    }

    let imagePath = null;

    if (image && typeof image === "object") {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const db = await getDB();
    await db.query(
      `INSERT INTO templates 
        (name, category, description, tag, image, demoUrl, useUrl, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, category, description, tag, imagePath, demoUrl, useUrl]
    );

    return NextResponse.json({ message: "✅ Template berhasil ditambahkan" });
  } catch (error) {
    console.error("🔥 ERROR POST /api/templates:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ============================================================
// ✏️ PUT → Edit template
// ============================================================
export async function PUT(req) {
  try {
    const formData = await req.formData();
    const id = formData.get("id");

    const name = formData.get("name");
    const category = formData.get("category");
    const description = formData.get("description");
    const tag = formData.get("tag");
    const demoUrl = formData.get("demoUrl");
    const useUrl = formData.get("useUrl");
    const image = formData.get("image");

    if (!id) {
      return NextResponse.json({ error: "ID template tidak ditemukan" }, { status: 400 });
    }

    const db = await getDB();

    // Ambil data lama
    const [oldData] = await db.query("SELECT * FROM templates WHERE id = ?", [id]);
    if (!oldData.length) {
      return NextResponse.json({ error: "Template tidak ditemukan" }, { status: 404 });
    }

    let imagePath = oldData[0].image;
    if (image && typeof image === "object") {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    await db.query(
      `UPDATE templates 
       SET name=?, category=?, description=?, tag=?, image=?, demoUrl=?, useUrl=? 
       WHERE id=?`,
      [name, category, description, tag, imagePath, demoUrl, useUrl, id]
    );

    return NextResponse.json({ message: "✅ Template berhasil diperbarui" });
  } catch (error) {
    console.error("🔥 ERROR PUT /api/templates:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ============================================================
// 🗑️ DELETE → Hapus template
// ============================================================
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID template tidak ditemukan" }, { status: 400 });
    }

    const db = await getDB();

    // Cek data lama
    const [oldData] = await db.query("SELECT image FROM templates WHERE id = ?", [id]);
    if (oldData.length && oldData[0].image) {
      const oldImagePath = path.join(process.cwd(), "public", oldData[0].image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    await db.query("DELETE FROM templates WHERE id = ?", [id]);

    return NextResponse.json({ message: "🗑️ Template berhasil dihapus" });
  } catch (error) {
    console.error("🔥 ERROR DELETE /api/templates:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
