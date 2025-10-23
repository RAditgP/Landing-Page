import { getDB } from "../../lib/db";

export async function GET() {
  try {
    const db = await getDB();
    const [rows] = await db.query("SELECT * FROM templates ORDER BY id DESC");
    return Response.json(rows);
  } catch (error) {
    console.error("❌ GET error:", error);
    return Response.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, description, image } = await req.json();
    const db = await getDB();

    await db.query(
      "INSERT INTO templates (name, description, image) VALUES (?, ?, ?)",
      [name, description, image]
    );

    return Response.json({ message: "✅ Template berhasil ditambahkan!" });
  } catch (error) {
    console.error("❌ POST error:", error);
    return Response.json({ error: "Gagal menambah template" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, name, description, image } = await req.json();
    const db = await getDB();

    await db.query(
      "UPDATE templates SET name = ?, description = ?, image = ? WHERE id = ?",
      [name, description, image, id]
    );

    return Response.json({ message: "✅ Template berhasil diperbarui!" });
  } catch (error) {
    console.error("❌ PUT error:", error);
    return Response.json({ error: "Gagal memperbarui template" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const db = await getDB();

    await db.query("DELETE FROM templates WHERE id = ?", [id]);
    return Response.json({ message: "✅ Template berhasil dihapus!" });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return Response.json({ error: "Gagal menghapus template" }, { status: 500 });
  }
}
