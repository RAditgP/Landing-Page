// app/api/kontak/route.js

import { NextResponse } from 'next/server';
import { getDB } from "../../lib/db";// Asumsi Anda membuat koneksi prisma di sini

// Handler untuk metode POST
export async function POST(request) {
  try {
    const data = await request.json();
    const { namaLengkap, alamatEmail, pesanAnda } = data;

    // 1. Validasi Sederhana
    if (!namaLengkap || !alamatEmail || !pesanAnda) {
      return NextResponse.json(
        { message: 'Semua field wajib diisi.' },
        { status: 400 }
      );
    }

    // 2. Simpan Data menggunakan Prisma
    const pesanBaru = await prisma.pesanKontak.create({
      data: {
        namaLengkap,
        alamatEmail,
        pesanAnda,
        // Properti dibaca dan dikirimPada akan menggunakan nilai default
      },
    });

    // 3. Kirim Respon Sukses
    return NextResponse.json(
      { message: 'Pesan berhasil dikirim!', data: pesanBaru },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    console.error('Error saat menyimpan pesan:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server.' },
      { status: 500 }
    );
  }
}