'use client';

import { useState, useEffect, useCallback } from 'react';
import moment from 'moment'; // Pastikan Anda menginstal moment.js (npm install moment) atau gunakan Date bawaan
// import AdminLayout from '@/components/AdminLayout'; // Asumsi Anda memiliki layout admin
import AdminLayout from '../layout';
// Tipe data untuk pesan (opsional, untuk TypeScript, tapi membantu di JS juga)
// Sesuaikan dengan skema Prisma Anda
const initialMessage = {
  id: '',
  namaLengkap: '',
  alamatEmail: '',
  pesanAnda: '',
  dibaca: false,
  dikirimPada: '',
};

export default function AdminPesanPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. FUNGSI UNTUK MENGAMBIL DATA PESAN
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Panggil API Route GET yang sudah Anda buat di /app/api/admin/pesan/route.js
      const response = await fetch('/api/admin/pesan'); 
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data pesan dari server.');
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);


  // 2. FUNGSI UNTUK MENANDAI PESAN SEBAGAI SUDAH DIBACA
  const handleMarkAsRead = async (id) => {
    // Optimistic UI Update: Ubah status di state lokal segera, sebelum menunggu respons server
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, dibaca: true } : msg
      )
    );

    try {
      // Panggil API Route untuk update status (Anda harus membuat API ini, misalnya menggunakan PATCH)
      const response = await fetch(`/api/admin/pesan/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dibaca: true }),
      });

      if (!response.ok) {
        // Jika gagal, kembalikan status di UI (pessimistic update)
        alert('Gagal memperbarui status pesan di database.');
        fetchMessages(); // Ambil ulang data untuk sinkronisasi
      }
    } catch (error) {
      alert('Terjadi error koneksi saat update status.');
      console.error('Error marking as read:', error);
      fetchMessages(); // Ambil ulang data
    }
  };

  
  // ================= TAMPILAN (RENDER) =================
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-white text-center py-10">Memuat Pesan...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-400 text-center py-10">Error: {error}</div>
      </AdminLayout>
    );
  }

  return (
    // <AdminLayout> // Hapus komentar ini jika Anda menggunakan layout admin
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">Dashboard Pesan Masuk</h1>
      
      {messages.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
          Tidak ada pesan kontak baru.
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-xl">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Waktu Kirim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pesan</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {messages.map((message) => (
                <tr key={message.id} className={message.dibaca ? 'bg-gray-900/50' : 'bg-gray-800 hover:bg-gray-700 transition'}>
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      message.dibaca ? 'bg-gray-600 text-gray-300' : 'bg-blue-600 text-white'
                    }`}>
                      {message.dibaca ? 'Sudah Dibaca' : 'Baru'}
                    </span>
                  </td>
                  
                  {/* Waktu Kirim */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {moment(message.dikirimPada).format('DD MMM YY, HH:mm')}
                  </td>
                  
                  {/* Nama */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{message.namaLengkap}</td>
                  
                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                    <a href={`mailto:${message.alamatEmail}`}>{message.alamatEmail}</a>
                  </td>
                  
                  {/* Pesan (Potongan) */}
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                    {message.pesanAnda.substring(0, 50)}...
                  </td>
                  
                  {/* Aksi */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!message.dibaca && (
                      <button
                        onClick={() => handleMarkAsRead(message.id)}
                        className="text-green-400 hover:text-green-600 transition"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    // </AdminLayout>
  );
}