// src/app/profile/PasswordModal.js
'use client';

import { useState } from 'react';

export default function PasswordModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('Sandi Baru dan Konfirmasi Sandi tidak cocok.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Sandi Baru minimal 8 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      // Ganti '/api/user/password' dengan endpoint API Anda
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form setelah sukses
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // onClose(); // Opsional: tutup modal setelah sukses
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal mengubah sandi. Pastikan sandi lama benar.');
      }
    } catch (err) {
      setError('Koneksi gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Ubah Sandi</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {success && (
          <div className="bg-green-600/30 text-green-300 p-3 rounded-md mb-4 border border-green-500">
            Sandi berhasil diperbarui!
          </div>
        )}

        {error && (
          <div className="bg-red-600/30 text-red-300 p-3 rounded-md mb-4 border border-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Sandi Lama"
            value={oldPassword}
            onChange={(e) => { setOldPassword(e.target.value); setError(null); setSuccess(false); }}
            required
            className="w-full p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Sandi Baru (Min. 8 Karakter)"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setError(null); setSuccess(false); }}
            required
            className="w-full p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Konfirmasi Sandi Baru"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(null); setSuccess(false); }}
            required
            className="w-full p-3 bg-gray-700 rounded-md text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <button
            type="submit"
            disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 8}
            className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition disabled:bg-gray-500"
          >
            {isLoading ? 'Mengubah Sandi...' : 'Konfirmasi Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}