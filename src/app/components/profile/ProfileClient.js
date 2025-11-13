// src/app/profile/ProfileClient.js
'use client';

import { useState } from 'react';
import Avatar from './Avatar'; // Import komponen Avatar
import NameForm from './NameForm'; // Import form ganti nama
import PasswordModal from './PasswordModal'; // Import modal ganti sandi

// Komponen Helper untuk tampilan detail yang konsisten
const DetailItem = ({ label, value, actionComponent }) => (
  <div className="flex justify-between border-b border-gray-600 pb-2">
    <strong className="font-medium text-gray-400">{label}:</strong>
    <span className={`font-semibold text-white`}>
      {value}
    </span>
    {actionComponent}
  </div>
);

export default function ProfileClient({ initialUser }) {
  // Gunakan state untuk data user yang bisa berubah (nama)
  const [user, setUser] = useState(initialUser);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Helper untuk menampilkan nama yang lebih baik
  const displayName = user.name || user.email.split('@')[0];

  // Callback untuk update data user setelah sukses ganti nama/foto
  const handleUserUpdate = (updatedData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedData }));
    setIsNameEditing(false); // Matikan mode edit nama jika ada
  };

  return (
    <>
      <div className="max-w-xl w-full bg-gray-800 shadow-2xl rounded-xl p-8 border border-blue-600/50">
        
        {/* Header Dashboard & Foto Profil */}
        <div className="text-center mb-10">
          <Avatar 
            user={user} 
            onAvatarUpdate={handleUserUpdate} 
          />
          <h1 className="text-3xl font-bold text-white mt-4">
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
            
            {/* Implementasi Ganti Nama */}
            {!isNameEditing ? (
              <DetailItem 
                label="Nama Lengkap" 
                value={user.name || 'Belum diatur'} 
                actionComponent={
                  <button 
                    onClick={() => setIsNameEditing(true)}
                    className="ml-4 text-sm text-blue-400 hover:text-blue-300 font-medium transition"
                  >
                    {user.name ? 'Ubah' : 'Atur'}
                  </button>
                }
              />
            ) : (
              // Tampilkan Form Ganti Nama jika sedang mengedit
              <NameForm 
                currentName={user.name} 
                onSuccess={handleUserUpdate} 
                onCancel={() => setIsNameEditing(false)} 
              />
            )}

          </div>
        </div>

        {/* --- Area Pengaturan Lain --- */}
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Pengaturan</h2>
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner text-gray-300 flex justify-between items-center">
                <p>Kelola sandi akun Anda.</p>
                {/* Tombol Ubah Sandi akan membuka modal */}
                <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition"
                >
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

      {/* Modal Ganti Sandi */}
      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </>
  );
}