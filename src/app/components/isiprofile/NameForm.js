'use client';

import { useState } from 'react';

// Fungsi dummy untuk simulasi update nama ke API
const updateNameApi = async (newName) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Simulasi: Mengubah nama menjadi "${newName}"`);
            resolve({ success: true, name: newName });
        }, 1000); // Simulasi penundaan 1 detik
    });
};

export default function NameForm({ currentName, onUpdate }) {
  const [newName, setNewName] = useState(currentName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newName.trim() === currentName) {
      setIsEditing(false);
      return;
    }
    
    if (newName.trim().length < 3) {
      setError("Nama harus memiliki minimal 3 karakter.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await updateNameApi(newName.trim());
      if (result.success) {
        onUpdate({ name: result.name });
        setIsEditing(false);
        // Tambahkan notifikasi sukses di aplikasi nyata
      } else {
        setError("Gagal menyimpan nama. Coba lagi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-slate-600 rounded-lg bg-slate-800">
      <h3 className="text-lg font-bold text-white mb-2">Nama Tampilan</h3>
      
      {!isEditing ? (
        <div className="flex justify-between items-center">
          <p className="text-slate-300 font-medium">{currentName}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition duration-150"
          >
            Ubah
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Masukkan nama baru"
            disabled={isLoading}
            className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500 mb-2"
          />
          
          {error && <p className="text-red-400 text-xs mb-2">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setNewName(currentName || '');
                setError(null);
              }}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition duration-150"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-150 shadow-md flex items-center ${
                isLoading 
                ? 'bg-blue-800 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Simpan'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}