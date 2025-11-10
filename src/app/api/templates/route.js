import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// GET - Ambil semua data template
// ============================================================
export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error("🔥 ERROR GET /api/templates:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ============================================================
// POST - Tambah template baru
// ============================================================
export async function POST(req) {
  try {
    const { name, description, image, category } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Field 'name' dan 'description' wajib diisi" },
        { status: 400 }
      );
    }

    const newTemplate = await prisma.template.create({
      data: {
        name,
        description,
        image,
        category,
      },
    });

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error("🔥 ERROR POST /api/templates:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
