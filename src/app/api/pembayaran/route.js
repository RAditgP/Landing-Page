// File: src/app/api/pembayaran/route.js

import { NextResponse } from "next/server";
import { getDB } from "../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // ⚠️ DEBUGGING: Pastikan semua data ada dan tidak null/undefined
    if (!body.nama || !body.email || !body.plan?.name || !body.plan?.price) {
        throw new Error("Data pembayaran tidak lengkap.");
    }

    // Simpan data ke tabel Transaction
   // File: app/api/pembayaran/route.js
// ...

// ...
  // Simpan data ke tabel Transaction
  const transaksi = await prisma.transaction.create({
    data: {
      nama: body.nama,
      email: body.email,
      paket: body.plan.name,
      // body.plan.price sekarang berisi string murni seperti "49000" atau "0"
      harga: body.plan.price, 
      metode: body.metode || "transfer",
    },
  });
// ...

    return NextResponse.json({
      success: true,
      id: transaksi.id,
    }, { status: 200 }); // Status 200 OK

  } catch (error) {
    // 🔑 Kunci: Cetak error teknis di server
    console.error("❌ Gagal menyimpan data transaksi (Server Error):", error); 
    
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan data pembayaran" },
      // Status 500 Internal Server Error, agar client tahu ini masalah server
      { status: 500 } 
    );
  }
}