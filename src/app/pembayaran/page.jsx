"use client";
import { useState, useMemo, useCallback, useEffect } from "react"; 
import { CreditCard, Zap, CheckCircle, Package, Banknote, QrCode, Wallet, ArrowLeft, Loader2, Info, Lock, Clock, X, Copy } from 'lucide-react';

// --- MOCK HOOKS untuk menggantikan 'next/navigation' ---

const useRouter = () => {
    // Simulasi useRouter untuk back dan push
    return {
        back: () => window.history.back(),
        push: (url) => window.location.href = url,
    };
};
// --- AKHIR MOCK HOOKS ---

// Komponen Input Kustom untuk konsistensi styling
const CustomInput = ({ id, name, label, value, onChange, placeholder, error, type = 'text', maxLength, disabled }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required
            disabled={disabled}
            maxLength={maxLength}
            className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${error ? 'border-red-500 ring-red-500' : 'border-gray-600 focus:ring-blue-500 border'} disabled:opacity-50`}
            placeholder={placeholder}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
);

// --- KOMPONEN INPUT DINAMIS METODE PEMBAYARAN ---
const PaymentDetails = ({ methodKey, paymentData, setPaymentData, errors }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({ ...prev, [name]: value }));
    };

    switch (methodKey) {
        case 'card':
            return (
                <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <h4 className="text-base font-semibold text-white mb-3 flex items-center">
                        <Lock size={16} className="mr-2 text-red-400" /> Detail Kartu Kredit / Debit
                    </h4>
                    <CustomInput
                        id="cardNumber"
                        name="cardNumber"
                        label="Nomor Kartu"
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={paymentData.cardNumber || ''}
                        onChange={handleChange}
                        error={errors.cardNumber}
                        maxLength={16}
                    />
                    <div className="flex space-x-4">
                        <CustomInput
                            id="expiryDate"
                            name="expiryDate"
                            label="Kedaluwarsa (MM/YY)"
                            type="text"
                            placeholder="MM/YY"
                            value={paymentData.expiryDate || ''}
                            onChange={handleChange}
                            error={errors.expiryDate}
                            maxLength={5}
                        />
                        <CustomInput
                            id="cvc"
                            name="cvc"
                            label="CVC"
                            type="password"
                            placeholder="***"
                            value={paymentData.cvc || ''}
                            onChange={handleChange}
                            error={errors.cvc}
                            maxLength={4}
                        />
                    </div>
                </div>
            );
        case 'transfer':
        case 'va':
            return (
                <div className="p-4 bg-gray-700 rounded-lg border border-blue-500/50">
                    <h4 className="text-base font-semibold text-white mb-2 flex items-center">
                        <Clock size={16} className="mr-2 text-blue-400" /> Informasi Transfer / Virtual Account
                    </h4>
                    <p className="text-sm text-gray-300">
                        Anda akan menerima nomor Virtual Account (atau rekening tujuan) dan instruksi lengkap di modal pop-up setelah menekan tombol Bayar. Pembayaran memiliki batas waktu 24 jam.
                    </p>
                </div>
            );
        case 'qris':
            return (
                <div className="p-4 bg-gray-700 rounded-lg border border-green-500/50">
                    <h4 className="text-base font-semibold text-white mb-2 flex items-center">
                        <QrCode size={16} className="mr-2 text-green-400" /> Pembayaran QRIS
                    </h4>
                    <p className="text-sm text-gray-300">
                        Kode QRIS akan ditampilkan di modal pop-up setelah Anda menekan Bayar. Anda dapat memindai kode tersebut menggunakan aplikasi pembayaran digital apa pun.
                    </p>
                </div>
            );
        default:
            return <p className="text-sm text-gray-400 p-2">Tidak ada detail pembayaran tambahan yang diperlukan untuk metode ini.</p>;
    }
};

// --- KOMPONEN MODAL INSTRUKSI PEMBAYARAN (Transfer/VA/QRIS) ---
const PaymentInstructionModal = ({ show, onClose, onFinishPayment, totalFinalDisplay, paymentMethodName, isLoading, methodKey }) => {
    
    if (!show) return null;

    // Data simulasi
    const bankName = "BCA (Simulasi)";
    const virtualAccount = "7000187845612345";
    const expiration = "24 Oktober 2025, 15:00 WIB";

    const handleCopy = (text) => {
        // Menggunakan document.execCommand('copy') karena navigator.clipboard mungkin diblokir di iframe
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('Nomor Virtual Account disalin!'); // Ganti dengan pesan notifikasi yang lebih baik jika bisa
    };
    
    // Konten dinamis berdasarkan metode
    const renderContent = () => {
        if (methodKey === 'qris') {
             return (
                <div className="text-center">
                    <QrCode size={120} className="mx-auto text-white bg-blue-500 p-4 rounded-xl mb-4" />
                    <p className="text-lg font-bold text-white mb-1">Pindai Kode QRIS Ini</p>
                    <p className="text-sm text-gray-400">Gunakan aplikasi pembayaran digital (GoPay, OVO, m-Banking) untuk memindai kode ini dan menyelesaikan pembayaran.</p>
                </div>
            );
        }

        // Default: Transfer / VA
        return (
            <div>
                <div className="mb-4 p-4 bg-blue-900/40 rounded-lg border border-blue-600">
                    <p className="text-sm text-blue-300 mb-1">Bank Tujuan</p>
                    <p className="text-xl font-extrabold text-white">{bankName}</p>
                </div>

                <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-400 mb-1">{paymentMethodName} (Simulasi)</p>
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-extrabold text-yellow-400 tracking-wider">{virtualAccount}</span>
                        <button 
                            onClick={() => handleCopy(virtualAccount)} 
                            className="p-2 ml-3 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition flex items-center text-sm"
                        >
                            <Copy size={16} className="mr-1" /> Salin
                        </button>
                    </div>
                </div>
                
                <div className="mb-4 p-3 bg-red-900/40 rounded-lg flex items-center">
                    <Clock size={16} className="text-red-400 mr-2 flex-shrink-0" />
                    <p className="text-xs text-red-300">Batas waktu pembayaran: {expiration}</p>
                </div>

                <p className="text-sm text-gray-300 mb-4">
                    Instruksi lengkap telah dikirimkan ke email Anda. Silakan transfer tepat <span className="font-bold text-white">{totalFinalDisplay}</span> untuk menghindari kegagalan sistem.
                </p>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-blue-500 max-w-md w-full transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <Banknote size={20} className="mr-2 text-green-400" /> {methodKey === 'qris' ? 'QRIS Dibuat' : 'Detail Pembayaran Dibuat'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                {renderContent()}

                <button
                    onClick={onFinishPayment}
                    disabled={isLoading}
                    className="w-full py-3 font-extrabold rounded-lg transition duration-300 mt-4 flex items-center justify-center bg-green-600 hover:bg-green-500 text-white disabled:bg-gray-600 disabled:text-gray-400"
                >
                    {isLoading ? (
                        <><Loader2 size={20} className="mr-2 animate-spin" /> Memproses...</>
                    ) : (
                        <><CheckCircle size={20} className="mr-2" /> Saya Sudah Bayar (Simulasi Selesai)</>
                    )}
                </button>
                <button
                    onClick={onClose}
                    className="w-full py-2 font-medium rounded-lg transition duration-300 mt-2 text-sm text-gray-400 hover:text-white"
                >
                    Tutup dan Kembali
                </button>
            </div>
        </div>
    );
};
// --- AKHIR MODAL INSTRUKSI ---


// --- KOMPONEN MODAL PAYMENT GATEWAY (SIMULASI OTP) ---
const PaymentGatewayModal = ({ show, onClose, onConfirmPayment, totalFinalDisplay, paymentMethodName, isLoading, error }) => {
    const [otpInput, setOtpInput] = useState('');
    const [otpError, setOtpError] = useState('');

    if (!show) return null;

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Hanya angka
        setOtpInput(value);
        setOtpError('');
    };

    const handleConfirm = () => {
        if (otpInput === '123456') { // Kode OTP simulasi yang benar
            onConfirmPayment();
        } else {
            setOtpError('Kode OTP tidak valid. Gunakan 123456 sebagai simulasi.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-blue-500 max-w-sm w-full transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                    <h2 className="text-xl font-bold text-yellow-400 flex items-center">
                        <Lock size={20} className="mr-2" /> Verifikasi Pembayaran
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <p className="text-sm text-gray-300 mb-4">
                    Transaksi senilai <span className="font-bold text-lg text-white">{totalFinalDisplay}</span> akan diproses menggunakan **{paymentMethodName}**.
                </p>

                <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">
                        Kami telah mengirimkan Kode OTP 6 digit ke nomor ponsel terdaftar.
                    </p>
                    <CustomInput
                        id="otp"
                        name="otp"
                        label="Kode OTP (Simulasi)"
                        type="text"
                        placeholder="123456"
                        value={otpInput}
                        onChange={handleOtpChange}
                        error={otpError}
                        maxLength={6}
                    />
                    <p className="text-xs text-red-400 mt-[-10px]">{otpError}</p>
                </div>
                
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}


                <button
                    onClick={handleConfirm}
                    disabled={isLoading || otpInput.length !== 6}
                    className="w-full py-3 font-extrabold rounded-lg transition duration-300 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white disabled:bg-gray-600 disabled:text-gray-400"
                >
                    {isLoading ? (
                        <><Loader2 size={20} className="mr-2 animate-spin" /> Memverifikasi...</>
                    ) : (
                        <><CheckCircle size={20} className="mr-2" /> Konfirmasi Bayar</>
                    )}
                </button>
            </div>
        </div>
    );
};
// --- AKHIR MODAL OTP ---


export default function PembayaranPage() {
    // --- START: HYDRATION FIX ---
    const [isMounted, setIsMounted] = useState(false);
    const [urlPlanKey, setUrlPlanKey] = useState("gratis"); // Default safe for SSR
    const router = useRouter();

    useEffect(() => {
        // This code runs only on the client after mounting
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const plan = params.get("plan")?.toLowerCase();
            if (plan) {
                setUrlPlanKey(plan);
            }
        }
        setIsMounted(true);
    }, []);

    const planKey = urlPlanKey;
    // --- END: HYDRATION FIX ---


    // --- DATA CONFIG ---
    const PAYMENT_METHODS = [
        { key: "transfer", name: "Transfer Bank", icon: Banknote },
        { key: "va", name: "Virtual Account", icon: Banknote }, 
        { key: "qris", name: "QRIS", icon: QrCode },
        { key: "card", name: "Kartu Kredit / Debit", icon: CreditCard },
        { key: "e-wallet", name: "GoPay / OVO / Dana", icon: Wallet },
    ];

    const PLANS_DATA = {
        pro: { name: "Pro", priceValue: 49000, priceDisplay: "Rp 49.000", key: "pro" },
        bisnis: { name: "Bisnis", priceValue: 99000, priceDisplay: "Rp 99.000", key: "bisnis" },
        gratis: { name: "Gratis", priceValue: 0, priceDisplay: "Rp 0", key: "gratis" }
    };

    const PPN_RATE = 0.11; // 11% PPN

    // Gunakan planKey dari state (yang aman dari SSR)
    const selectedPlan = PLANS_DATA[planKey] || PLANS_DATA.gratis;

    // --- LOGIKA HARGA ---
    const { subtotal, ppn, totalFinal, totalFinalDisplay } = useMemo(() => {
        const subtotalValue = selectedPlan.priceValue;
        const ppnValue = subtotalValue > 0 ? subtotalValue * PPN_RATE : 0;
        const totalFinalValue = subtotalValue + ppnValue;

        const formatRupiah = (value) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(value);
        };

        return {
            subtotal: formatRupiah(subtotalValue),
            ppn: formatRupiah(ppnValue),
            totalFinal: totalFinalValue,
            totalFinalDisplay: formatRupiah(totalFinalValue),
        };
    }, [selectedPlan.priceValue]);

    // --- STATE FORM & LOADING ---
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        // Metode diinisialisasi berdasarkan harga paket yang sudah aman
        metode: selectedPlan.priceValue > 0 ? PAYMENT_METHODS[0].key : '', 
        setujuSNC: false,
    });
    
    // STATE UNTUK DETAIL PEMBAYARAN TAMBAHAN
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    
    // STATE UNTUK MODAL
    const [showPaymentModal, setShowPaymentModal] = useState(false); // Untuk OTP/Card
    const [showInstructionModal, setShowInstructionModal] = useState(false); // Untuk VA/Transfer/QRIS


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
        setError('');
    };

    // Fungsi untuk melanjutkan ke halaman sukses (dipanggil dari modal)
    const proceedToSuccessPage = useCallback(async () => {
        setIsLoading(true);
        setError('');

        const methodDisplay = PAYMENT_METHODS.find(m => m.key === formData.metode)?.name || formData.metode;
        // Gunakan date.now() untuk ID yang lebih unik, namun Math.random() juga cukup
        const transactionId = 'INV-' + Math.floor(Math.random() * 1000000) + Date.now().toString().slice(-4); 

        try {
            // Simulasi loading sebelum redirect
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            const queryParams = new URLSearchParams({
                id: transactionId,
                paket: selectedPlan.name,
                harga: totalFinalDisplay, 
                metode: methodDisplay,
                email: formData.email
            });

            router.push(`/pembayaran/sukses?${queryParams.toString()}`);

        } catch (err) {
            console.error("Client side error during final confirmation:", err);
            setError('Terjadi kesalahan saat konfirmasi akhir. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
            // Tutup modal setelah proses (jika belum redirect)
            setShowPaymentModal(false);
            setShowInstructionModal(false);
        }
    }, [formData, selectedPlan, totalFinalDisplay, router, PAYMENT_METHODS]);


    // --- VALIDASI FORM UTAMA DAN DETAIL PEMBAYARAN ---
    const validateForm = () => {
        const errors = {};
        let detailErrors = {};

        if (!formData.nama.trim()) { errors.nama = "Nama lengkap wajib diisi."; }
        if (!formData.email.trim()) { errors.email = "Email wajib diisi."; } 
        else if (!/\S+@\S+\.\S+/.test(formData.email)) { errors.email = "Format email tidak valid."; }

        if (selectedPlan.priceValue > 0) {
            if (!formData.metode) { errors.metode = "Metode pembayaran wajib dipilih."; }
            if (!formData.setujuSNC) { errors.setujuSNC = "Anda harus menyetujui Syarat & Ketentuan."; }

            // Validasi Detail Pembayaran Kartu
            if (formData.metode === 'card') {
                if (!paymentData.cardNumber || paymentData.cardNumber.length !== 16) {
                    detailErrors.cardNumber = "Nomor kartu harus 16 digit.";
                }
                if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
                    detailErrors.expiryDate = "Format kedaluwarsa tidak valid (MM/YY).";
                }
                if (!paymentData.cvc || paymentData.cvc.length < 3) {
                    detailErrors.cvc = "CVC harus 3 atau 4 digit.";
                }
            }
        }
        
        const combinedErrors = { ...errors, ...detailErrors };
        setValidationErrors(combinedErrors);

        return Object.keys(combinedErrors).length === 0;
    };

    // --- HANDLE PEMBAYARAN (MAIN BUTTON CLICK) ---
    const handleBayar = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setError('Mohon lengkapi semua data yang diperlukan dengan benar.');
            return;
        }
        
        const methodKey = formData.metode;
        
        // Cek apakah metode memerlukan modal verifikasi (Kartu Kredit/E-Wallet)
        if (methodKey === 'card' || methodKey === 'e-wallet') {
            // Tampilkan modal OTP/Verifikasi
            setShowPaymentModal(true);
            return; 
        }

        // Cek apakah metode memerlukan modal instruksi (Transfer, VA, QRIS)
        if (methodKey === 'transfer' || methodKey === 'va' || methodKey === 'qris') {
            // Tampilkan modal Instruksi Pembayaran (VA/QRIS)
            setShowInstructionModal(true);
            return;
        }

        // Untuk paket GRATIS (priceValue === 0)
        if (selectedPlan.priceValue === 0) {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                proceedToSuccessPage();
            } catch (err) {
                console.error("Client side error during free plan sign up:", err);
                setError(err.message || 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.');
            }
        }
    };

    const handleBack = () => router.back();
    
    // Tombol CTA Label
    const ctaLabel = selectedPlan.priceValue === 0 
        ? 'Lanjutkan Pendaftaran' 
        : `Bayar ${totalFinalDisplay} Sekarang`;

    const paymentMethodName = PAYMENT_METHODS.find(m => m.key === formData.metode)?.name;
    
    // Tampilkan loader atau konten utama hanya setelah mount untuk menghindari CLS/FOUC
    if (!isMounted) {
        return (
             <main className="bg-gray-900 min-h-screen text-white pt-10 pb-20 font-inter flex justify-center items-center">
                <Loader2 size={32} className="animate-spin text-blue-500" />
                <span className="ml-3 text-lg text-blue-400">Memuat halaman pembayaran...</span>
            </main>
        );
    }

    return (
        <main className="bg-gray-900 min-h-screen text-white pt-10 pb-20 font-inter">
            <section className="px-4 sm:px-8 flex flex-col items-center">
                <div className="max-w-lg w-full mb-6">
                    <button 
                        onClick={handleBack}
                        className="flex items-center text-blue-400 hover:text-blue-300 transition duration-150 mb-4 text-sm font-medium"
                    >
                        <ArrowLeft size={18} className="mr-1" />
                        Kembali ke Pilihan Paket
                    </button>
                    <div className="flex items-center text-left">
                        <CreditCard size={32} className="text-yellow-400 mr-2 hidden sm:block" />
                        <h1 className="text-3xl sm:text-4xl font-extrabold">Penyelesaian Pembayaran</h1>
                    </div>
                </div>
                
                <div className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700 max-w-lg w-full">
                    
                    {/* --- 1. RINGKASAN HARGA TRANSPRAN --- */}
                    <div className="bg-gray-700 p-5 rounded-xl mb-6 border border-blue-500/50">
                        <div className="flex justify-between items-center mb-1 pb-2 border-b border-gray-600">
                            <div className="flex items-center text-xl font-bold text-white">
                                <Package size={20} className="mr-2 text-green-400" /> 
                                Paket: {selectedPlan.name}
                            </div>
                            <span className="text-2xl font-extrabold text-blue-400">
                                {selectedPlan.priceDisplay}
                            </span>
                        </div>
                        
                        {selectedPlan.priceValue > 0 && (
                            <div className="mt-3 space-y-1 text-sm">
                                <div className="flex justify-between text-gray-300">
                                    <span>Subtotal</span>
                                    <span>{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span className="flex items-center">
                                        PPN (11%)
                                        <Info size={14} className="ml-1 text-gray-500" title="Pajak Pertambahan Nilai" />
                                    </span>
                                    <span>{ppn}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-600 text-lg font-bold">
                                    <span>TOTAL AKHIR</span>
                                    <span className="text-yellow-400">{totalFinalDisplay}</span>
                                </div>
                            </div>
                        )}
                        
                        <p className="text-sm text-gray-400 mt-2">Harga sudah termasuk pajak untuk pembayaran per bulan.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleBayar}>
                        
                        {/* --- 6. PESAN ERROR UTAMA (Di atas form) --- */}
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-sm transition-opacity duration-300">
                                {error}
                            </div>
                        )}

                        {/* --- 2. INPUT NAMA --- */}
                        <CustomInput
                            id="nama"
                            name="nama"
                            label="Nama Lengkap"
                            type="text"
                            placeholder="Masukkan nama kamu"
                            value={formData.nama}
                            onChange={handleChange}
                            error={validationErrors.nama}
                        />

                        {/* --- 3. INPUT EMAIL --- */}
                        <CustomInput
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="Masukkan email kamu"
                            value={formData.email}
                            onChange={handleChange}
                            error={validationErrors.email}
                        />

                        {/* --- 4. METODE PEMBAYARAN (Hanya untuk paket berbayar) --- */}
                        {selectedPlan.priceValue > 0 && (
                            <div>
                                <h3 className="mb-3 text-sm font-medium text-gray-300">Pilih Metode Pembayaran</h3>
                                <div className="space-y-3">
                                    {PAYMENT_METHODS.map((method) => {
                                        const IconComponent = method.icon;
                                        const isSelected = formData.metode === method.key;

                                        return (
                                            <label
                                                key={method.key}
                                                className={`flex items-center p-4 rounded-xl cursor-pointer transition duration-200 border-2 shadow-sm
                                                    ${isSelected
                                                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30'
                                                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-blue-500/50'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="metode"
                                                    value={method.key}
                                                    checked={isSelected}
                                                    onChange={handleChange} // Menggunakan handleChange utama
                                                    className="hidden"
                                                />
                                                <IconComponent size={24} className={`mr-4 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                                                <span className="font-semibold text-base">{method.name}</span>
                                                {isSelected && <CheckCircle size={18} className="ml-auto text-white" />}
                                            </label>
                                        );
                                    })}
                                </div>
                                {validationErrors.metode && <p className="mt-1 text-xs text-red-400">{validationErrors.metode}</p>}
                            </div>
                        )}

                        {/* --- 4b. DETAIL INPUT DINAMIS BERDASARKAN METODE --- */}
                        {selectedPlan.priceValue > 0 && formData.metode && (
                            <div className="mt-6">
                                <PaymentDetails 
                                    methodKey={formData.metode} 
                                    paymentData={{...paymentData, email: formData.email}} 
                                    setPaymentData={setPaymentData}
                                    errors={validationErrors}
                                />
                            </div>
                        )}
                        
                        {/* --- 5. PERSETUJUAN SYARAT & KETENTUAN (Hanya untuk paket berbayar) --- */}
                        {selectedPlan.priceValue > 0 && (
                            <div className="pt-2">
                                <label className="flex items-start cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="setujuSNC"
                                        checked={formData.setujuSNC}
                                        onChange={handleChange}
                                        className="mt-1 mr-3 h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-300">
                                        Saya telah membaca dan menyetujui <a href="/syarat-ketentuan" target="_blank" className="text-blue-400 hover:underline">Syarat & Ketentuan</a> dan <a href="/kebijakan-privasi" target="_blank" className="text-blue-400 hover:underline">Kebijakan Privasi</a>.
                                    </span>
                                </label>
                                {validationErrors.setujuSNC && <p className="mt-1 text-xs text-red-400">{validationErrors.setujuSNC}</p>}
                            </div>
                        )}


                        {/* --- 7. TOMBOL CTA --- */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`mt-6 w-full py-4 font-extrabold rounded-xl shadow-lg transition duration-300 flex items-center justify-center text-lg
                                ${selectedPlan.priceValue === 0 
                                    ? 'bg-green-500 hover:bg-green-400 text-gray-900 shadow-green-500/40' 
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/40'}
                                disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <><Loader2 size={20} className="mr-2 animate-spin" /> Memproses...</>
                            ) : selectedPlan.priceValue === 0 ? (
                                <><CheckCircle size={20} className="mr-2" /> {ctaLabel}</>
                            ) : (
                                <><Zap size={20} className="mr-2" /> {ctaLabel}</>
                            )}
                        </button>
                    </form>
                    
                    <p className="text-center text-xs text-gray-500 mt-6">
                        <CreditCard size={14} className="inline mr-1 text-gray-500" /> Transaksi dijamin aman dan terenkripsi.
                    </p>
                </div>
            </section>
            
            {/* --- MODAL PAYMENT GATEWAY (OTP) --- */}
            <PaymentGatewayModal
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onConfirmPayment={proceedToSuccessPage}
                totalFinalDisplay={totalFinalDisplay}
                paymentMethodName={paymentMethodName}
                isLoading={isLoading}
                error={error}
            />

            {/* --- MODAL INSTRUKSI PEMBAYARAN (VA/Transfer/QRIS) --- */}
            <PaymentInstructionModal
                show={showInstructionModal}
                onClose={() => setShowInstructionModal(false)}
                onFinishPayment={proceedToSuccessPage}
                totalFinalDisplay={totalFinalDisplay}
                paymentMethodName={paymentMethodName}
                isLoading={isLoading}
                methodKey={formData.metode}
            />
        </main>
    );
}
