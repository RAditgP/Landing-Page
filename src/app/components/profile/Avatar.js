// src/app/profile/Avatar.js
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

// Fungsi helper untuk mendapatkan inisial
const getInitials = (name, email) => {
    const text = name || email.split('@')[0];
    const parts = text.split(' ');
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return text[0].toUpperCase();
};

export default function Avatar({ user, onAvatarUpdate }) {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const initials = getInitials(user.name, user.email);
    const avatarUrl = user.avatarUrl; // Asumsi field avatarUrl ada di data user

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            // Ganti '/api/user/avatar' dengan endpoint API Anda
            const response = await fetch('/api/user/avatar', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                // Panggil callback untuk update state di ProfileClient
                onAvatarUpdate({ avatarUrl: result.newAvatarUrl }); 
                alert('Foto profil berhasil diperbarui!');
            } else {
                alert('Gagal mengunggah foto profil.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Terjadi kesalahan saat mengunggah.');
        } finally {
            setIsUploading(false);
            // Reset input file agar bisa upload file yang sama lagi
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            
            {/* Tampilan Foto atau Placeholder */}
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt="Foto Profil"
                    fill
                    className="rounded-full object-cover border-4 border-blue-500 transition-shadow group-hover:shadow-lg group-hover:shadow-blue-500/50"
                />
            ) : (
                <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-blue-500 transition-shadow group-hover:shadow-lg group-hover:shadow-blue-500/50">
                    {initials}
                </div>
            )}

            {/* Overlay Icon Kamera saat di-hover */}
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                {isUploading ? (
                    <span className="text-white text-sm">Loading...</span> // Placeholder untuk loading
                ) : (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.863-1.296A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.863 1.296A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                )}
            </div>

            {/* Input File tersembunyi */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
            />
        </div>
    );
}