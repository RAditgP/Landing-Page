import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-util";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (user) {
      // ✅ User sedang login
      return NextResponse.json(
        {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
        { status: 200 }
      );
    } else {
      // ❌ Tidak ada sesi login aktif
      return NextResponse.json(
        { success: false, user: null, message: "User belum login." },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("❌ Error di /api/auth/status:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
