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
      if (!response.ok) throw new Error('Gagal mengambil data pesan dari server.');

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
    <div className="min-h-screen w-full p-8 bg-white text-gray-900">

      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Pesan Masuk
        </h1>
        <p className="mt-1 text-gray-500">Lihat semua pesan dari pengunjung website anda</p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-3">Sedang memuat pesan...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-600 py-6 bg-red-100 border border-red-300 rounded-xl">
          Error: {error}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && messages.length === 0 && (
        <div className="max-w-xl mx-auto mt-10 bg-gray-100 border border-gray-300 rounded-2xl p-10 text-center shadow">
          <Mail className="h-16 w-16 mx-auto text-gray-400" />
          <h3 className="text-lg text-gray-700 mt-4">Tidak ada pesan kontak baru</h3>
          <p className="text-gray-500 text-sm mt-1">Pesan dari pengunjung akan muncul di sini</p>
        </div>
      )}

      {/* Message Cards */}
      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="p-6 rounded-2xl bg-white shadow-lg border border-gray-200 transition transform hover:scale-[1.02] hover:shadow-xl"
          >
            {/* Status & Timestamp */}
            <div className="flex justify-between items-center mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold 
                ${msg.dibaca ? 'bg-gray-300 text-gray-700' : 'bg-indigo-600 text-white'}`}
              >
                {msg.dibaca ? 'Sudah Dibaca' : 'Baru'}
              </span>

              <span className="text-sm text-gray-500">
                {moment(msg.dikirimPada).format('DD MMM YYYY • HH:mm')}
              </span>
            </div>

            {/* Nama */}
            <h2 className="text-2xl font-bold text-gray-900">{msg.namaLengkap}</h2>

            {/* Email */}
            <a
              href={`mailto:${msg.alamatEmail}`}
              className="text-indigo-600 hover:underline text-sm"
            >
              {msg.alamatEmail}
            </a>

            {/* Pesan */}
            <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
              {msg.pesanAnda}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
}
