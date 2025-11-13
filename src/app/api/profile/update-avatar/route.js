// src/app/api/profile/update-avatar/route.js

import { NextResponse } from 'next/server';
import { usersCollection } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * Route Handler untuk PATCH /api/profile/update-avatar
 * Memperbarui URL foto profil pengguna di Firestore.
 */
export async function PATCH(request) {
    try {
        // PERHATIAN: Di sini, kita menganggap userEmail adalah ID dokumen.
        // Dalam produksi, ID harus diambil dari token sesi untuk keamanan.
        const { newAvatarUrl, userEmail } = await request.json(); 

        if (!newAvatarUrl || !userEmail) {
            return NextResponse.json({ message: 'URL Avatar dan email tidak valid.' }, { status: 400 });
        }
        
        // 1. Dapatkan referensi dokumen pengguna berdasarkan email
        const userDocRef = doc(usersCollection, userEmail);

        // 2. Perbarui field 'avatarUrl'
        await updateDoc(userDocRef, {
            avatarUrl: newAvatarUrl,
            updatedAt: new Date().toISOString(),
        });

        // 3. Berikan respons sukses
        return NextResponse.json({ 
            message: 'Avatar berhasil diperbarui.', 
            avatarUrl: newAvatarUrl 
        }, { status: 200 });

    } catch (error) {
        console.error("Kesalahan saat update avatar:", error);
        return NextResponse.json({ message: 'Kesalahan Internal Server saat memperbarui avatar.' }, { status: 500 });
    }
}