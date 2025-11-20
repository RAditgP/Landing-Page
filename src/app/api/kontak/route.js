import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { namaLengkap, alamatEmail, pesanAnda } = await req.json();

    if (!namaLengkap || !alamatEmail || !pesanAnda) {
      return NextResponse.json(
        { message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const pesanBaru = await prisma.pesankontak.create({
      data: {
        namaLengkap,
        alamatEmail,
        pesanAnda,
      },
    });

    return NextResponse.json(
      { message: "Pesan berhasil dikirim!", data: pesanBaru },
      { status: 201 }
    );

  } catch (error) {
    console.error("🔥 ERROR POST /api/kontak:", error);
    return NextResponse.json(
      { message: error.message || "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}