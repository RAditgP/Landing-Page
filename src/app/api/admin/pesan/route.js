import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pesan = await prisma.pesankontak.findMany({
      orderBy: {
        dikirimPada: "desc",
      },
    });

    return NextResponse.json(pesan, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin messages:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data pesan dari server." },
      { status: 500 }
    );
  }
}
