// src/app/api/auth/logout/route.js (VERSI PERBAIKAN)

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Hapus cookie sesi
  cookies().set('session_token', '', { 
    maxAge: 0, 
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  // 🔑 PERBAIKAN: Hanya kirim respons 200 OK
  return new Response(null, { status: 200 }); 
}