"use client";
import { useState, useMemo, useCallback, useEffect } from "react"; 
import { CreditCard, Zap, CheckCircle, Package, ArrowLeft, Loader2, Info, Lock, Clock, X } from 'lucide-react';

// --- MOCK ROUTER ---
const useRouter = () => ({
    back: () => window.history.back(),
    push: (url) => window.location.href = url,
});

// KOMPONEN INPUT
const CustomInput = ({ id, name, label, value, onChange, placeholder, error, type='text', maxLength }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required
            maxLength={maxLength}
            className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${error?'border-red-500 ring-red-500':'border-gray-600 focus:ring-blue-500 border'}`}
            placeholder={placeholder}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
);

// === KOMPONEN DETAIL PEMBAYARAN (Hanya Kartu Kredit / Debit) ===
const PaymentDetails = ({ paymentData, setPaymentData, errors }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({ ...prev, [name]: value }));
    };

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
};

// === MODAL OTP (Tetap Dipakai Untuk Kartu Kredit) ===
const PaymentGatewayModal = ({ show, onClose, onConfirmPayment, totalFinalDisplay, paymentMethodName, isLoading, error }) => {
    const [otpInput, setOtpInput] = useState('');
    const [otpError, setOtpError] = useState('');

    if (!show) return null;

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setOtpInput(value);
        setOtpError('');
    };

    const handleConfirm = () => {
        if (otpInput === '123456') {
            onConfirmPayment();
        } else {
            setOtpError("Kode OTP salah. Gunakan 123456 untuk simulasi.");
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 sm:p-8 rounded-xl border border-blue-500 max-w-sm w-full">
                
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                    <h2 className="text-xl font-bold text-yellow-400 flex items-center">
                        <Lock size={20} className="mr-2" /> Verifikasi Pembayaran
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24}/>
                    </button>
                </div>

                <p className="text-sm text-gray-300 mb-4">
                    Transaksi senilai <span className="font-bold text-white">{totalFinalDisplay}</span> akan diproses menggunakan {paymentMethodName}.
                </p>

                <CustomInput
                    id="otp"
                    name="otp"
                    label="Kode OTP"
                    type="text"
                    placeholder="123456"
                    value={otpInput}
                    onChange={handleOtpChange}
                    error={otpError}
                    maxLength={6}
                />

                {error && (
                    <div className="bg-red-900/40 border border-red-500 text-red-300 p-3 rounded-lg mt-3 text-sm">
                        {error}
                    </div>
                )}

                <button 
                    onClick={handleConfirm}
                    disabled={isLoading || otpInput.length !== 6}
                    className="w-full py-3 mt-5 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold flex items-center justify-center disabled:bg-gray-600"
                >
                    {isLoading ? (
                        <><Loader2 size={18} className="mr-2 animate-spin"/> Memverifikasi...</>
                    ) : (
                        <><CheckCircle size={18} className="mr-2"/> Konfirmasi Bayar</>
                    )}
                </button>
            </div>
        </div>
    );
};

// ========================================================
// ====================== PAGE UTAMA ======================
// ========================================================

export default function PembayaranPage() {

    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [urlPlanKey, setUrlPlanKey] = useState("gratis");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const plan = params.get("plan");
            if (plan) setUrlPlanKey(plan.toLowerCase());
        }
        setIsMounted(true);
    }, []);

    const planKey = urlPlanKey;

    // === DATA PAKET ===
    const PLANS_DATA = {
        pro: { name: "Pro", priceValue: 49000, priceDisplay: "Rp 49.000" },
        bisnis: { name: "Bisnis", priceValue: 99000, priceDisplay: "Rp 99.000" },
        gratis: { name: "Gratis", priceValue: 0, priceDisplay: "Rp 0" }
    };

    const selectedPlan = PLANS_DATA[planKey] || PLANS_DATA.gratis;

    // === HITUNGAN HARGA ===
    const PPN_RATE = 0.11;

    const { subtotal, ppn, totalFinal, totalFinalDisplay } = useMemo(() => {
        const subtotalValue = selectedPlan.priceValue;
        const ppnValue = subtotalValue > 0 ? subtotalValue * PPN_RATE : 0;
        const totalFinalValue = subtotalValue + ppnValue;

        const rp = (v) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

        return {
            subtotal: rp(subtotalValue),
            ppn: rp(ppnValue),
            totalFinal: totalFinalValue,
            totalFinalDisplay: rp(totalFinalValue),
        };
    }, [selectedPlan.priceValue]);

    // === STATE FORM ===
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        metode: "card",
        setujuSNC: false,
    });

    const [paymentData, setPaymentData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvc: "",
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        setValidationErrors(prev => ({ ...prev, [name]: "" }));
    };

    // === VALIDASI ===
    const validateForm = () => {
        const errors = {};
        const detailErrors = {};

        if (!formData.nama.trim()) errors.nama = "Nama wajib diisi.";
        if (!formData.email.trim()) errors.email = "Email wajib diisi.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Format email tidak valid.";

        if (!formData.setujuSNC) errors.setujuSNC = "Anda harus menyetujui S&K.";

        // Validasi card ONLY
        if (!paymentData.cardNumber || paymentData.cardNumber.length !== 16)
            detailErrors.cardNumber = "Nomor kartu harus 16 digit.";

        if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate))
            detailErrors.expiryDate = "Format harus MM/YY.";

        if (!paymentData.cvc || paymentData.cvc.length < 3)
            detailErrors.cvc = "CVC harus 3–4 digit.";

        const combined = { ...errors, ...detailErrors };
        setValidationErrors(combined);

        return Object.keys(combined).length === 0;
    };

    // === SUBMIT ===
    const handleBayar = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setError("Lengkapi semua data dengan benar.");
            return;
        }
        setShowPaymentModal(true);
    };

    const proceedToSuccess = useCallback(async () => {
        setIsLoading(true);

        await new Promise(r => setTimeout(r, 1500));

        router.push(`/pembayaran/sukses?id=INV-${Date.now()}&paket=${selectedPlan.name}&harga=${totalFinalDisplay}&metode=Kartu Kredit&email=${formData.email}`);

    }, [router, selectedPlan, totalFinalDisplay, formData.email]);

    if (!isMounted) {
        return (
            <main className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <Loader2 size={32} className="animate-spin text-blue-400"/>
            </main>
        );
    }

    return (
        <main className="bg-gray-900 min-h-screen text-white py-10">
            <section className="px-4 flex flex-col items-center">

                <div className="max-w-lg w-full mb-6">
                    <button 
                        onClick={router.back}
                        className="flex items-center text-blue-400 hover:text-blue-300 mb-3"
                    >
                        <ArrowLeft size={18} className="mr-1"/> Kembali
                    </button>

                    <h1 className="text-3xl font-extrabold flex items-center">
                        <CreditCard size={32} className="text-yellow-400 mr-2"/> Pembayaran
                    </h1>
                </div>

                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 max-w-lg w-full">

                    {/* Ringkasan harga */}
                    <div className="bg-gray-700 p-5 rounded-xl mb-6 border border-blue-500/50">
                        <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-2">
                            <span className="flex items-center text-xl font-bold">
                                <Package size={20} className="mr-2 text-green-400"/> Paket: {selectedPlan.name}
                            </span>
                            <span className="text-2xl font-extrabold text-blue-400">
                                {selectedPlan.priceDisplay}
                            </span>
                        </div>

                        {selectedPlan.priceValue > 0 && (
                            <>
                                <div className="text-sm text-gray-300 flex justify-between">
                                    <span>Subtotal</span> <span>{subtotal}</span>
                                </div>
                                <div className="text-sm text-gray-300 flex justify-between mb-2">
                                    <span className="flex items-center">PPN 11% <Info size={14} className="ml-1"/></span>
                                    <span>{ppn}</span>
                                </div>

                                <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-2">
                                    <span>Total Akhir</span>
                                    <span className="text-yellow-400">{totalFinalDisplay}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <form onSubmit={handleBayar} className="space-y-6">

                        {error && (
                            <div className="bg-red-900/40 border border-red-500 text-red-300 p-3 rounded-lg">{error}</div>
                        )}

                        <CustomInput
                            id="nama"
                            name="nama"
                            label="Nama Lengkap"
                            value={formData.nama}
                            onChange={handleChange}
                            placeholder="Nama kamu"
                            error={validationErrors.nama}
                        />

                        <CustomInput
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            error={validationErrors.email}
                        />

                        {/* Hanya 1 metode: Card */}
                        <div>
                            <div className="p-4 rounded-xl bg-blue-600 border-2 border-blue-400 flex items-center">
                                <CreditCard size={24} className="mr-4"/> 
                                <span className="text-lg font-semibold">Kartu Kredit / Debit</span>
                                <CheckCircle size={18} className="ml-auto text-white"/>
                            </div>
                        </div>

                        <PaymentDetails paymentData={paymentData} setPaymentData={setPaymentData} errors={validationErrors}/>

                        <label className="flex items-start cursor-pointer pt-2">
                            <input 
                                type="checkbox" 
                                name="setujuSNC" 
                                checked={formData.setujuSNC}
                                onChange={handleChange}
                                className="mt-1 mr-3 h-4 w-4 text-blue-600"
                            />
                            <span className="text-sm">
                                Saya setuju dengan <a className="text-blue-400">Syarat & Ketentuan</a>.
                            </span>
                        </label>
                        {validationErrors.setujuSNC && <p className="text-xs text-red-400">{validationErrors.setujuSNC}</p>}

                        <button
                            type="submit"
                            className="mt-4 w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-extrabold flex items-center justify-center"
                        >
                            <Zap size={20} className="mr-2"/> Bayar {totalFinalDisplay}
                        </button>
                    </form>
                </div>
            </section>

            {/* Modal OTP */}
            <PaymentGatewayModal 
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onConfirmPayment={proceedToSuccess}
                totalFinalDisplay={totalFinalDisplay}
                paymentMethodName="Kartu Kredit / Debit"
                isLoading={isLoading}
            />
        </main>
    );
}
