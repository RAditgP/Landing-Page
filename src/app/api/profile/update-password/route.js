// src/app/api/profile/update-password/route.js

import { NextResponse } from 'next/server';
import { usersCollection } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

/**
 * Simulasi Fungsi Hashing Kata Sandi (Harus sama dengan fungsi di register)
 */
function hashPassword(password) {
    // Harus sama persis dengan fungsi di route.js register
    return `hashed_${password}_secret`; 
}

/**
 * Route Handler untuk PATCH /api/profile/update-password
 * Memperbarui sandi pengguna setelah verifikasi sandi lama.
 */
export async function PATCH(request) {
    try {
        const { email, currentPassword, newPassword } = await request.json();

        if (!email || !currentPassword || !newPassword) {
            return NextResponse.json({ message: 'Semua kolom sandi wajib diisi.' }, { status: 400 });
        }

        // 1. Dapatkan dokumen pengguna
        const userDocRef = doc(usersCollection, email);
        const userSnap = await getDoc(userDocRef);

        if (!userSnap.exists()) {
            return NextResponse.json({ message: 'Pengguna tidak ditemukan.' }, { status: 404 });
        }

        const userData = userSnap.data();
        
        // 2. Verifikasi sandi lama (simulasi)
        const hashedPasswordAttempt = hashPassword(currentPassword);

        if (hashedPasswordAttempt !== userData.password) {
            return NextResponse.json({ message: 'Sandi saat ini salah.' }, { status: 401 });
        }

        // 3. Hash sandi baru
        const newHashedPassword = hashPassword(newPassword);

        // 4. Perbarui sandi di Firestore
        await updateDoc(userDocRef, {
            password: newHashedPassword,
            updatedAt: new Date().toISOString(),
        });

        // 5. Berikan respons sukses
        return NextResponse.json({ 
            message: 'Kata sandi berhasil diubah.'
        }, { status: 200 });

    } catch (error) {
        console.error("Kesalahan saat update sandi:", error);
        return NextResponse.json({ message: 'Kesalahan Internal Server saat memperbarui sandi.' }, { status: 500 });
    }
}