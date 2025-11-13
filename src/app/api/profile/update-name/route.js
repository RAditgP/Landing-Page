// src/app/api/profile/update-name/route.js

import { NextResponse } from 'next/server';
import { usersCollection } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

/**
 * Route Handler untuk PATCH /api/profile/update-name
 * Memperbarui nama lengkap pengguna di Firestore.
 */
export async function PATCH(request) {
    try {
        // Dalam aplikasi nyata, Anda akan mendapatkan email (atau user ID)
        // dari token otorisasi, BUKAN dari body request, untuk keamanan.
        const { newName, userEmail } = await request.json(); 

        if (!newName || !userEmail) {
            return NextResponse.json({ message: 'Nama baru dan email tidak valid.' }, { status: 400 });
        }
        
        const trimmedName = newName.trim();

        // 1. Dapatkan referensi dokumen pengguna berdasarkan email (yang digunakan sebagai ID dokumen)
        const userDocRef = doc(usersCollection, userEmail);

        // 2. Perbarui field 'name'
        await updateDoc(userDocRef, {
            name: trimmedName,
            updatedAt: new Date().toISOString(),
        });

        // 3. Berikan respons sukses
        return NextResponse.json({ 
            message: 'Nama berhasil diperbarui.', 
            name: trimmedName 
        }, { status: 200 });

    } catch (error) {
        console.error("Kesalahan saat update nama:", error);
        return NextResponse.json({ message: 'Kesalahan Internal Server saat memperbarui nama.' }, { status: 500 });
    }
}