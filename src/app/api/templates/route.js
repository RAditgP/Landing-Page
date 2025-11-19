import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// ======================================================================
// GET: Ambil semua template
// ======================================================================
export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(templates);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ======================================================================
// POST: Tambah template baru
// ======================================================================
export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const category = formData.get("category");
    const description = formData.get("description");
    const tag = formData.get("tag");
    const demoUrl = formData.get("demoUrl");
    const useUrl = formData.get("useUrl");
    const file = formData.get("image");

    let imagePath = "";

    // Upload gambar baru
    if (file && typeof file === "object" && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads", "templates");
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      imagePath = `/uploads/templates/${filename}`;
    }

    const newTemplate = await prisma.template.create({
      data: {
        name,
        category,
        description,
        tag,
        demoUrl,
        useUrl,
        image: imagePath,
      },
    });

    return NextResponse.json(
      { message: "Template berhasil ditambahkan!", newTemplate },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ======================================================================
// PUT: Edit template (gambar opsional)
// ======================================================================
export async function PUT(req) {
  try {
    const formData = await req.formData();
    const id = parseInt(formData.get("id"), 10);
    const name = formData.get("name");
    const category = formData.get("category");
    const description = formData.get("description");
    const tag = formData.get("tag");
    const demoUrl = formData.get("demoUrl");
    const useUrl = formData.get("useUrl");
    const file = formData.get("image");

    // ambil gambar lama
    let imagePath = formData.get("oldImage");

    // jika upload gambar baru → replace
    if (file && typeof file === "object" && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads", "templates");
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      imagePath = `/uploads/templates/${filename}`;
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        name,
        category,
        description,
        tag,
        demoUrl,
        useUrl,
        image: imagePath,
      },
    });

    return NextResponse.json({
      message: "Template berhasil diperbarui!",
      updatedTemplate,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ======================================================================
// DELETE: Hapus template
// ======================================================================
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await prisma.template.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Template berhasil dihapus!" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
