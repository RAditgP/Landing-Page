'use client';

import { useState } from 'react';

// Fungsi dummy untuk simulasi unggah file
const simulateUpload = async (file) => {
  return new Promise((resolve) => {
    // Simulasi penundaan jaringan 1.5 detik
    setTimeout(() => {
      // Dalam aplikasi nyata, ini akan menjadi URL dari CDN/Penyimpanan
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // Menggunakan base64 URL sebagai simulasi
      };
      reader.readAsDataURL(file);
    }, 1500);
  });
};

export default function Avatar({ currentAvatarUrl, currentName, onUpdate }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // Batasan 2MB
      setError("Ukuran file terlalu besar (Maks. 2MB).");
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      // Simulasi API call untuk unggah
      const newUrl = await simulateUpload(file);
      
      // Setelah berhasil, panggil fungsi update dari ProfileClient
      onUpdate({ avatarUrl: newUrl });
      
    } catch (err) {
      setError("Gagal mengunggah foto. Coba lagi.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-xl mb-4">
      
      {/* Tampilan Avatar */}
      <div className="relative w-24 h-24 flex-shrink-0">
        {currentAvatarUrl ? (
          <img 
            src={currentAvatarUrl} 
            alt={`Avatar dari ${currentName}`} 
            className="w-full h-full object-cover rounded-full border-4 border-blue-400 shadow-xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center rounded-full bg-blue-600 text-white text-3xl font-bold border-4 border-blue-400 shadow-xl">
            {getInitials(currentName)}
          </div>
        )}
      </div>

      {/* Kontrol Unggah */}
      <div className="flex flex-col">
        <p className="text-lg font-semibold text-white">Foto Profil</p>
        <p className="text-sm text-slate-400 mb-2">JPG, PNG. Maks. 2MB</p>
        
        <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className={`px-4 py-2 text-sm font-medium rounded-lg transition duration-200 shadow-md inline-flex items-center justify-center ${
                isUploading 
                ? 'bg-slate-500 text-slate-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}>
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengunggah...
                </>
              ) : 'Pilih Foto Baru'}
            </div>
        </label>
        <input 
          id="avatar-upload"
          type="file" 
          accept="image/png, image/jpeg" 
          onChange={handleFileChange} 
          disabled={isUploading}
          className="hidden" 
        />
        
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
}