// src/app/dashboard/page.js
// Server Component - untuk otorisasi dan memuat data awal

import { redirect } from 'next/navigation';
// Asumsi path dan fungsi ini sudah ada dan berfungsi
import { getCurrentUser } from '@/lib/auth'; 

// Import komponen Client Profile Management
// Pastikan path ini sesuai jika Anda menempatkannya di 'src/components/'
import ProfileManagement from '@/app/components/ProfileManagement.jsx';
import Link from 'next/link';
import { LogOut,ArrowLeft } from 'lucide-react';

export default async function DashboardPage() {
  // 1. Otorisasi dan Ambil Data Pengguna
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }
  
  // Jika menggunakan Firebase/Auth, pastikan data yang diambil mencakup 
  // email, name, dan id/uid, serta avatarUrl jika ada.
  const initialUser = {
      id: user.id,
      email: user.email,
      name: user.name || '',
      avatarUrl: user.avatarUrl || null,
  };


  return (
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl border border-gray-700 relative mt-8 mb-8">
        {/* Tombol Kembali */}
        <Link
          href="/"
          className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition duration-200"
          title="Kembali ke Beranda"
        >
          <ArrowLeft size={24} />
        </Link>
        {/* Header Dashboard */}
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-1">Pengaturan Profil</h1>
            <p className="text-gray-400">Kelola informasi, sandi, dan foto akun Anda.</p>
        </div>

        {/* 2. Render Client Component dan Kirim Data User */}
        {/* ProfileManagement sekarang menangani semua logika UI: Nama, Sandi, Foto, Logout */}
        <ProfileManagement initialUser={initialUser} />
        
        {/* Tombol Logout Sisi Server (Fallback) */}
        {/* Anda bisa menggunakan tombol Logout di dalam ProfileManagement untuk interaksi client-side */}
        

      </div>
    </main>
  );
}