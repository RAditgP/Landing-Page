// src/app/dashboard/page.js
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-util';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Helper untuk menampilkan nama yang lebih baik
  const displayName = user.name || user.email.split('@')[0];

  return (
    // Mengubah background menjadi gelap (seperti halaman DevLaunch Anda)
    <main className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-16">
      
      <div className="max-w-xl w-full bg-gray-800 shadow-2xl rounded-xl p-8 border border-blue-600/50">
        
        {/* Header Dashboard */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">
            Selamat Datang, <span className="text-blue-400">{displayName}</span> 🎉
          </h1>
          <p className="text-gray-400 mt-2">
            Kelola informasi dan pengaturan akun Anda di sini.
          </p>
        </div>

        {/* --- Card Detail Akun --- */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Profil Pengguna
          </h2>
          
          <div className="space-y-4 text-gray-300">
            <DetailItem label="ID Pengguna" value={user.id} />
            <DetailItem label="Alamat Email" value={user.email} />
            <DetailItem label="Nama Lengkap" value={user.name || 'Belum diatur'} highlight={!user.name} />
            {/* Anda bisa menambahkan kolom lain seperti tanggal pendaftaran di sini */}
          </div>
        </div>

        {/* --- Area Pengaturan Lain (Placeholder) --- */}
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Pengaturan</h2>
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner text-gray-300">
                <p>Fitur untuk mengubah sandi dan data pribadi akan ditambahkan di sini.</p>
                {/* Contoh Tautan/Tombol Pengaturan */}
                <button className="mt-4 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition">
                    Ubah Sandi
                </button>
            </div>
        </div>


        {/* Tombol Logout */}
        <form action="/api/auth/logout" method="POST" className="mt-10 flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition shadow-lg shadow-red-500/50 transform hover:scale-[1.02]"
          >
            LOGOUT
          </button>
        </form>
      </div>
    </main>
  );
}

// Komponen Helper untuk tampilan detail yang konsisten
const DetailItem = ({ label, value, highlight = false }) => (
  <div className="flex justify-between border-b border-gray-600 pb-2">
    <strong className="font-medium text-gray-400">{label}:</strong>
    <span className={`font-semibold ${highlight ? 'text-yellow-400' : 'text-white'}`}>
      {value}
    </span>
  </div>
);