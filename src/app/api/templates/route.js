import { getDB } from "../../lib/db";

//===================================================================
// METHOD GET: Mengambil daftar semua template
//===================================================================
export async function GET() {
  try {
    const db = await getDB();
    const templates = await db.template.findMany({
      orderBy: { id: 'desc' }
    });
    return Response.json(templates);
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
    const { name, description, image, category } = await req.json();
    const db = await getDB();

    await db.template.create({
      data: {
        name,
        description,
        image,
        category
      }
    });

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
    const { id, name, description, image, category } = await req.json();
    const db = await getDB();

    await db.template.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        image,
        category
      }
    });

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

    await db.template.delete({
      where: { id: parseInt(id) }
    });

    return Response.json({ message: "✅ Template berhasil dihapus!" });
  } catch (error) {
    console.error("❌ DELETE error:", error);
    return Response.json({ error: "Gagal menghapus template" }, { status: 500 });
  }
}
