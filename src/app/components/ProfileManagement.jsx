// src/components/ProfileManagement.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, LogOut, Key } from 'lucide-react';

// Menggunakan sub-komponen dari folder 'profile'
import Avatar from './isiprofile/Avatar';
import NameForm from './isiprofile/NameForm';
import PasswordModal from './isiprofile/PasswordModal';

// Menerima initialUser (data dari Server Component) sebagai props
export default function ProfileManagement({ initialUser }) {
    const router = useRouter();
    // State lokal dari data awal
    const [user, setUser] = useState(initialUser); 
    
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isNameEditing, setIsNameEditing] = useState(false);
    const [message, setMessage] = useState(null); // Pesan feedback global

    // Fungsi untuk memperbarui user di state dan melakukan sinkronisasi lokal
    const updateLocalUser = (updatedFields) => {
        const updatedUser = { ...user, ...updatedFields };
        setUser(updatedUser);
        
        // --- LOGIKA SINKRONISASI DATA LOKAL (sesuai implementasi Anda) ---
        if (typeof window !== 'undefined' && localStorage.getItem('user')) {
             const storedUser = JSON.parse(localStorage.getItem('user'));
             // Asumsi: field name/avatarUrl perlu diperbarui di local storage
             localStorage.setItem('user', JSON.stringify({ ...storedUser, ...updatedFields }));
        }
        // ------------------------------------------------------------------
    };

    // Menangani Logout
    const handleLogout = async () => {
        // PANGGIL API LOGOUT
        await fetch('/api/auth/logout', { method: 'POST' });
        
        // Bersihkan data lokal
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
        
        router.push('/login');
    };

    if (!user || !user.email) {
        return <div className="text-white text-center py-10">Memuat profil...</div>;
    }

    return (
        <div>
            {/* Notifikasi Global */}
            {message && (
                <div className={`p-3 rounded-lg mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {message.text}
                </div>
            )}

            {/* Bagian Foto Profil */}
            <div className="mb-6 p-4 bg-gray-700 rounded-xl border border-gray-600">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-blue-400" /> Foto Profil</h2>
                <Avatar 
                    userName={user.name} 
                    userEmail={user.email} 
                    initialAvatarUrl={user.avatarUrl} 
                    onUpdate={(url) => {
                        updateLocalUser({ avatarUrl: url });
                        setMessage({ type: 'success', text: '✅ Foto profil berhasil diunggah.' });
                    }}
                />
            </div>
            
            {/* Bagian Informasi Dasar: Nama Lengkap & Email */}
            <div className="mb-6 p-4 bg-gray-700 rounded-xl border border-gray-600 space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center"><Mail className="w-5 h-5 mr-2 text-blue-400" /> Informasi Dasar</h2>

                {/* Email */}
                <div className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-400">Alamat Email (Digunakan sebagai ID)</p>
                    <p className="text-base text-white font-mono break-words">{user.email}</p>
                </div>

                {/* Form Nama Lengkap */}
                <NameForm 
                    currentName={user.name}
                    isEditing={isNameEditing}
                    setIsEditing={setIsNameEditing}
                    updateLocalUser={updateLocalUser}
                    setMessage={setMessage}
                    userEmail={user.email} 
                />
            </div>

            {/* Bagian Pengaturan Sandi & Logout */}
            <div className="p-4 bg-gray-700 rounded-xl border border-gray-600 space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center"><Key className="w-5 h-5 mr-2 text-red-400" /> Keamanan & Akses</h2>
                
                <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full bg-red-500/20 text-red-400 font-semibold py-3 rounded-lg hover:bg-red-500/30 transition border border-red-500/50 flex items-center justify-center"
                >
                    <Key size={20} className="mr-2" /> Ubah Kata Sandi
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg shadow-lg transition duration-300"
                >
                    <LogOut size={20} className="mr-2" /> Keluar (Logout)
                </button>
            </div>

            {/* Modal Ubah Sandi */}
            {isPasswordModalOpen && (
                <PasswordModal 
                    onClose={() => setIsPasswordModalOpen(false)}
                    userEmail={user.email} 
                    setMessage={setMessage}
                />
            )}
        </div>
    );
}