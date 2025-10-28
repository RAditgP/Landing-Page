// src/app/pembayaran/sukses/page.js
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Zap, Package, ArrowLeft } from 'lucide-react';

// Data untuk menampilkan nama metode yang mudah dibaca
const METHOD_NAMES = {
    transfer: "Transfer Bank",
    qris: "QRIS",
    card: "Kartu Kredit / Debit",
    'e-wallet': "GoPay / OVO / Dana",
};

export default function PembayaranSuksesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const paket = searchParams.get("paket");
    const harga = searchParams.get("harga");
    const metodeKey = searchParams.get("metode");

    // Tampilkan pesan error jika data kurang
    if (!paket || !harga || !metodeKey) {
        return (
            <main className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-8">
                <h1 className="text-3xl font-bold mb-4 text-red-500">❌ Error Transaksi</h1>
                <p className="text-gray-400">Detail transaksi tidak ditemukan. Silakan kembali ke halaman harga.</p>
                <button 
                    onClick={() => router.push('/harga')}
                    className="mt-6 py-2 px-4 bg-blue-600 rounded-lg hover:bg-blue-500"
                >
                    Kembali
                </button>
            </main>
        );
    }

    const metodeNama = METHOD_NAMES[metodeKey] || metodeKey;

    return (
        <main className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-8">
            <div className="bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center border-t-8 border-green-500">
                
                {/* Ikon Sukses */}
                <CheckCircle size={64} className="text-green-500 mx-auto mb-6 animate-pulse" />
                
                <h1 className="text-4xl font-extrabold mb-3">Pembayaran Berhasil!</h1>
                <p className="text-gray-300 mb-8">
                    Terima kasih atas pembayaran Anda. Akses paket **{paket.toUpperCase()}** Anda kini telah aktif!
                </p>

                {/* Ringkasan Transaksi */}
                <div className="text-left bg-gray-700 p-6 rounded-lg space-y-3">
                    <h2 className="text-xl font-bold mb-3 border-b border-gray-600 pb-2">Detail Transaksi</h2>
                    
                    <div className="flex justify-between">
                        <span className="text-gray-400">Paket Dipesan:</span>
                        <span className="font-semibold flex items-center">
                            <Package size={16} className="mr-2 text-blue-400" /> {paket.toUpperCase()}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-400">Jumlah Dibayar:</span>
                        <span className="font-extrabold text-2xl text-yellow-400">{harga}</span>
                    </div>
                    
                    <div className="flex justify-between pt-2 border-t border-gray-600">
                        <span className="text-gray-400">Metode Pembayaran:</span>
                        <span className="font-medium">{metodeNama}</span>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-8 space-y-3">
                    <button
                        onClick={() => router.push('/dashboard')} // Asumsikan Anda memiliki halaman dashboard
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 flex items-center justify-center"
                    >
                        <Zap size={20} className="mr-2" /> Mulai Proyek Sekarang
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-3 text-gray-400 font-bold rounded-lg hover:text-white transition duration-150 flex items-center justify-center"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Kembali ke Beranda
                    </button>
                </div>
            </div>
        </main>
    );
}