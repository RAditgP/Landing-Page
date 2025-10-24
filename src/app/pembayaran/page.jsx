"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, Zap, CheckCircle, Package, Banknote, QrCode, Wallet, ArrowLeft, Loader2 } from 'lucide-react'; 

export default function PembayaranPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const PAYMENT_METHODS = [
        { key: "transfer", name: "Transfer Bank", icon: Banknote },
        { key: "qris", name: "QRIS", icon: QrCode },
        { key: "card", name: "Kartu Kredit / Debit", icon: CreditCard },
        { key: "e-wallet", name: "GoPay / OVO / Dana", icon: Wallet },
    ];

    const PLANS_DATA = {
        pro: { name: "Pro", price: "Rp 49.000", key: "pro" },
        bisnis: { name: "Bisnis", price: "Rp 99.000", key: "bisnis" },
        gratis: { name: "Gratis", price: "Rp 0", key: "gratis" }
    };

    const planKey = searchParams.get("plan")?.toLowerCase() || "gratis";
    const selectedPlan = PLANS_DATA[planKey] || PLANS_DATA.gratis;

    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        metode: selectedPlan.price !== 'Rp 0' ? PAYMENT_METHODS[0].key : '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

   
const handleBayar = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError('');

    // ... (Validasi dan Body Request) ...

    const body = {
        nama: formData.nama,
        email: formData.email,
        metode: formData.metode,
        plan: {
            name: selectedPlan.name,
            price: selectedPlan.price.replace(/[Rp. ]/g, ''),
        }
    };

    try {
        const res = await fetch('/api/pembayaran', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // Hentikan proses jika respons bukan 2xx (tapi jangan jalankan .json() dulu)
        if (!res.ok) {
            // Coba parsing JSON dari error response, jika gagal, fallback ke pesan default
            let errorMessage = `Server Error: ${res.status}`;
            try {
                const errorData = await res.json(); 
                errorMessage = errorData.message || errorMessage;
            } catch (jsonError) {
                // Jika server mengembalikan HTML (bukan JSON) pada error, gunakan pesan default
                console.error("Failed to parse error JSON:", jsonError);
            }
            throw new Error(errorMessage);
        }

        // --- FETCH BERHASIL (Status 200 OK) ---
        const data = await res.json();
        console.log("Transaksi sukses, ID:", data.id);
        
        // Buat Query String untuk data paket yang diperlukan halaman sukses
        const queryParams = new URLSearchParams({
            id: data.id,
            paket: selectedPlan.name.toLowerCase(), // Kirim nama paket
            harga: selectedPlan.price,             // Kirim harga dengan format Rp. untuk display
            metode: formData.metode                // Kirim metode pembayaran
        });

        // 🔥 PENGALIHAN FINAL & BENAR: Menggunakan path /pembayaran/sukses
        router.push(`/pembayaran/sukses?${queryParams.toString()}`); 
        // 👇 Penting: Jangan lakukan operasi lain setelah router.push

    } catch (err) {
        console.error("Client side error:", err);
        setError(err.message || 'Terjadi kesalahan saat memproses pembayaran.');
    } finally {
        setIsLoading(false);
    }
};



    const handleBack = () => router.back();

    return (
        <main className="bg-gray-900 min-h-screen text-white pt-20">
            <section className="py-10 px-4 sm:px-8 flex flex-col items-center">
                <div className="max-w-lg w-full mb-6">
                    <button 
                        onClick={handleBack}
                        className="flex items-center text-blue-400 hover:text-blue-300 transition duration-150 mb-4 text-sm font-medium"
                    >
                        <ArrowLeft size={18} className="mr-1" />
                        Kembali ke Pilihan Paket
                    </button>
                    <div className="flex items-center text-left">
                        <CreditCard size={32} className="text-yellow-400 mr-2" />
                        <h1 className="text-3xl sm:text-4xl font-extrabold">Penyelesaian Pembayaran</h1>
                    </div>
                </div>
                
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 max-w-lg w-full">
                    <div className="bg-gray-700 p-5 rounded-lg mb-6 border border-blue-500/50">
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center text-xl font-bold text-white">
                                <Package size={20} className="mr-2 text-green-400" /> 
                                Paket: {selectedPlan.name}
                            </div>
                            <span className={`text-2xl font-extrabold ${selectedPlan.price === 'Rp 0' ? 'text-green-400' : 'text-blue-400'}`}>
                                {selectedPlan.price}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400">Harga final per bulan.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleBayar}>
                        <div>
                            <label htmlFor="nama" className="block mb-2 text-sm font-medium text-gray-300">Nama Lengkap</label>
                            <input
                                type="text"
                                id="nama"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan nama kamu"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan email kamu"
                            />
                        </div>

                        {selectedPlan.price !== 'Rp 0' && (
                            <div>
                                <h3 className="mb-3 text-sm font-medium text-gray-300">Pilih Metode Pembayaran</h3>
                                <div className="space-y-3">
                                    {PAYMENT_METHODS.map((method) => {
                                        const IconComponent = method.icon;
                                        const isSelected = formData.metode === method.key;

                                        return (
                                            <label
                                                key={method.key}
                                                className={`flex items-center p-4 rounded-lg cursor-pointer transition duration-200 border-2 ${
                                                    isSelected
                                                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg'
                                                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-blue-500/50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="metode"
                                                    value={method.key}
                                                    checked={isSelected}
                                                    onChange={(e) => setFormData({ ...formData, metode: e.target.value })}
                                                    className="hidden"
                                                />
                                                <IconComponent size={24} className={`mr-4 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                                                <span className="font-semibold text-base">{method.name}</span>
                                                {isSelected && <CheckCircle size={18} className="ml-auto text-white" />}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-sm transition-opacity duration-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`mt-6 w-full py-3 font-bold rounded-lg shadow-md transition duration-300 flex items-center justify-center 
                                ${selectedPlan.price === 'Rp 0' ? 'bg-green-500 hover:bg-green-400 text-gray-900' : 'bg-blue-600 hover:bg-blue-500 text-white'}
                                disabled:bg-gray-600 disabled:text-gray-400`}
                        >
                            {isLoading ? (
                                <><Loader2 size={20} className="mr-2 animate-spin" /> Memproses...</>
                            ) : selectedPlan.price === 'Rp 0' ? (
                                <><CheckCircle size={20} className="mr-2" /> Lanjutkan Pendaftaran</>
                            ) : (
                                <><Zap size={20} className="mr-2" /> Bayar {selectedPlan.price} Sekarang</>
                            )}
                        </button>
                    </form>
                    
                    <p className="text-center text-xs text-gray-500 mt-6">
                        Pembayaran Anda aman. Kami tidak menyimpan detail kartu kredit Anda.
                    </p>
                </div>
            </section>
        </main>
    );
}
