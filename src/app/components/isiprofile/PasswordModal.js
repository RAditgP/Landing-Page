'use client';

import { useState } from 'react';

// Fungsi dummy untuk simulasi ubah kata sandi
const changePasswordApi = async (oldPass, newPass) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (oldPass === "password_lama_anda") { // Simulasi kata sandi lama yang benar
                console.log(`Simulasi: Kata sandi berhasil diubah.`);
                resolve({ success: true });
            } else if (oldPass === "") {
                reject({ success: false, message: "Kata sandi lama tidak boleh kosong." });
            } else {
                reject({ success: false, message: "Kata sandi lama tidak valid." });
            }
        }, 1500); // Simulasi penundaan 1.5 detik
    });
};

export default function PasswordModal({ onClose }) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Kata sandi baru dan konfirmasi tidak cocok.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      await changePasswordApi(formData.oldPassword, formData.newPassword);
      setSuccess(true);
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message || "Gagal mengubah kata sandi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <ModalLayout onClose={onClose}>
        <div className="text-center p-6">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="text-2xl font-bold text-white mt-4">Berhasil!</h2>
            <p className="text-slate-400 mt-2">Kata sandi Anda telah diperbarui. Harap diingat baik-baik!</p>
            <button 
                onClick={onClose}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
                Tutup
            </button>
        </div>
      </ModalLayout>
    );
  }

  return (
    <ModalLayout onClose={onClose}>
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-3">Ubah Kata Sandi</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Kata Sandi Lama"
          name="oldPassword"
          type="password"
          value={formData.oldPassword}
          onChange={handleChange}
          disabled={isLoading}
        />
        <InputField
          label="Kata Sandi Baru"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          disabled={isLoading}
        />
        <InputField
          label="Konfirmasi Kata Sandi Baru"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
        />

        {error && (
          <div className="p-3 bg-red-800/30 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition duration-150"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-5 py-2 font-medium rounded-lg transition duration-150 flex items-center ${
              isLoading 
              ? 'bg-pink-800 cursor-not-allowed' 
              : 'bg-pink-600 hover:bg-pink-700 text-white shadow-lg'
            }`}
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Ubah Sandi
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}

// Komponen Pembantu untuk Input Field
const InputField = ({ label, name, type, value, onChange, disabled }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-pink-500 focus:border-pink-500 transition duration-150"
        />
    </div>
);

// Komponen Pembantu untuk Modal Layout
const ModalLayout = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
    <div 
      className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 p-6 relative"
      onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam menutup modal
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      {children}
    </div>
  </div>
);