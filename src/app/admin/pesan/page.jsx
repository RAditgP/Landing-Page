'use client';

import { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Mail } from 'lucide-react';

export default function AdminPesanPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/pesan');

      if (!response.ok) {
        throw new Error('Gagal mengambil data pesan dari server.');
      }

      setMessages(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className="min-h-screen w-full p-8 bg-gradient-to-br from-[#0a0f1f] via-[#0d1326] to-[#11182c] text-white">

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-blue-500 text-transparent bg-clip-text">
          Pesan Masuk
        </h1>
        <p className="mt-1 text-gray-400">Lihat semua pesan dari pengunjung website anda</p>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-3">Sedang memuat pesan...</p>
        </div>
      )}

      {error && (
        <div className="text-center text-red-400 py-6 bg-red-900/20 border border-red-600 rounded-xl">
          Error: {error}
        </div>
      )}

      {!isLoading && messages.length === 0 && (
        <div className="max-w-xl mx-auto mt-10 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-10 text-center shadow-xl">
          <Mail className="h-16 w-16 mx-auto text-gray-500 opacity-70" />
          <h3 className="text-lg text-gray-300 mt-4">Tidak ada pesan kontak baru</h3>
          <p className="text-gray-500 text-sm mt-1">Pesan dari pengunjung akan muncul di sini</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-6 rounded-2xl bg-white/10 shadow-lg 
            backdrop-blur-xl border border-white/10
            transition transform hover:scale-[1.02] hover:shadow-2xl"
          >
            <div className="flex justify-between items-center mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shadow 
                ${msg.dibaca ? 'bg-gray-600 text-gray-300' : 'bg-indigo-600 text-white'}`}
              >
                {msg.dibaca ? 'Sudah Dibaca' : 'Baru'}
              </span>

              <span className="text-sm text-gray-400">
                {moment(msg.dikirimPada).format('DD MMM YYYY • HH:mm')}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white">{msg.namaLengkap}</h2>

            <a
              href={`mailto:${msg.alamatEmail}`}
              className="text-indigo-400 hover:underline text-sm"
            >
              {msg.alamatEmail}
            </a>

            <p className="mt-4 text-gray-300 leading-relaxed whitespace-pre-line">
              {msg.pesanAnda}
            </p>

            {!msg.dibaca && (
              <button className="mt-5 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition duration-200 shadow">
                Tandai Dibaca
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
