"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
// Import semua ikon yang dibutuhkan, termasuk ArrowLeft untuk tombol Kembali
import { CreditCard, Zap, CheckCircle, Package, Banknote, QrCode, Wallet, ArrowLeft, Loader2 } from 'lucide-react'; 

export default function PembayaranPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Data Opsi Pembayaran (sama)
    const PAYMENT_METHODS = [
        { key: "transfer", name: "Transfer Bank", icon: Banknote },
        { key: "qris", name: "QRIS", icon: QrCode },
        { key: "card", name: "Kartu Kredit / Debit", icon: CreditCard },
        { key: "e-wallet", name: "GoPay / OVO / Dana", icon: Wallet },
    ];

    // Detail Paket (sama)
    const PLANS_DATA = {
        pro: { name: "Pro", price: "Rp 49.000", key: "pro" },
        bisnis: { name: "Bisnis", price: "Rp 99.000", key: "bisnis" },
        gratis: { name: "Gratis", price: "Rp 0", key: "gratis" }
    };

    const planKey = searchParams.get("plan")?.toLowerCase() || "gratis";
    const selectedPlan = PLANS_DATA[planKey] || PLANS_DATA.gratis;
    
    // State untuk form input (sama)
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        metode: selectedPlan.price !== 'Rp 0' ? PAYMENT_METHODS[0].key : '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(''); // State baru untuk pesan error

    // Update form state (sama)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Hapus error saat input berubah
    };

    const handleBayar = (e) => {
        e.preventDefault();
        setError(''); // Reset error

        if (selectedPlan.key === 'gratis') {
            router.push('/daftar');
            return;
        }

        // --- Validasi yang Ditingkatkan ---
        if (!formData.nama.trim()) {
            setError("Nama lengkap wajib diisi.");
            return;
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
            setError("Email tidak valid.");
            return;
        }
        if (selectedPlan.price !== 'Rp 0' && !formData.metode) {
            setError("Pilih salah satu metode pembayaran.");
            return;
        }

        setIsLoading(true);
        
        // --- Simulasi Proses Pembayaran ---
        setTimeout(() => {
            setIsLoading(false);
            
            // --- Mengarahkan ke halaman sukses dengan parameter URL ---
            router.push(
                `/pembayaran/sukses?paket=${selectedPlan.name}&harga=${selectedPlan.price}&metode=${formData.metode}`
            );
            
        }, 2000);
    };

    // Fungsi untuk tombol kembali
    const handleBack = () => {
        router.back();
    };

    return (
        <main className="bg-gray-900 min-h-screen text-white pt-20">
            {/* <Navbar /> */}

            <section className="py-10 px-4 sm:px-8 flex flex-col items-center">
                
                {/* --- BLOK TOMBOL KEMBALI DAN HEADER --- */}
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
                
                {/* --- BLOK FORMULIR --- */}
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 max-w-lg w-full">
                    
                    {/* Ringkasan Paket */}
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
                        {/* Nama Lengkap */}
                        <div>
                            <label htmlFor="nama" className="block mb-2 text-sm font-medium text-gray-300">Nama Lengkap</label>
                            <input
                                type="text"
                                id="nama"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                // required // Hapus required HTML
                                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan nama kamu"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                // required // Hapus required HTML
                                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan email kamu"
                            />
                        </div>

                        {/* Metode Pembayaran (Bergaya Kartu) */}
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
                                                className={`
                                                    flex items-center p-4 rounded-lg cursor-pointer transition duration-200 border-2
                                                    ${isSelected ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-blue-500/50'}
                                                `}
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
                        
                        {/* Pesan Error (Baru) */}
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-sm transition-opacity duration-300">
                                {error}
                            </div>
                        )}

                        {/* Tombol Pembayaran */}
                        <button
                            type="submit"
                            disabled={isLoading} // Hanya bergantung pada status loading
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

            {/* <Footer /> */}
        </main>
    );
}
