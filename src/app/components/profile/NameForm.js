// src/app/profile/NameForm.js
'use client';

import { useState } from 'react';

export default function NameForm({ currentName, onSuccess, onCancel }) {
  const [newName, setNewName] = useState(currentName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newName.trim() === currentName) {
      onCancel(); // Tidak ada perubahan, batalkan
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Ganti '/api/user/name' dengan endpoint API Anda
      const response = await fetch('/api/user/name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (response.ok) {
        // Asumsi API mengembalikan user object
        const updatedUser = await response.json(); 
        onSuccess(updatedUser);
        alert('Nama berhasil diperbarui!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Gagal mengubah nama.');
      }
    } catch (err) {
      setError('Koneksi gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-2">
      <div className="flex items-center space-x-2">
        <label htmlFor="name" className="sr-only">Nama Lengkap</label>
        <input
          id="name"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Masukkan nama lengkap Anda"
          required
          className="flex-grow p-2 bg-gray-600 border border-blue-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || newName.trim() === ''}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-500"
        >
          {isLoading ? 'Simpan...' : 'Simpan'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Batal
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </form>
  );
}