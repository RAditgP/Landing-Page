"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PembayaranPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil query dari URL, misal: /pembayaran?paket=Pro&harga=49000
  const paket = searchParams.get("paket") || "Gratis";
  const harga = searchParams.get("harga") || "Rp 0";

  const handleBayar = () => {
    alert(`Pembayaran untuk paket ${paket} sebesar ${harga} berhasil disimulasikan!`);
    router.push("/"); // Kembali ke beranda setelah "pembayaran"
  };

  return (
    <main className="bg-gray-900 min-h-screen text-white">
      <Navbar />

      <section className="py-16 px-4 sm:px-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-6">💳 Pembayaran</h1>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-4">
            Paket yang dipilih: <span className="text-blue-400">{paket}</span>
          </h2>
          <p className="text-lg text-gray-300 mb-8">Harga: {harga}</p>

          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-300">Nama Lengkap</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-md text-gray-900"
                placeholder="Masukkan nama kamu"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-md text-gray-900"
                placeholder="Masukkan email kamu"
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Metode Pembayaran</label>
              <select className="w-full px-3 py-2 rounded-md text-gray-900">
                <option>Transfer Bank</option>
                <option>QRIS</option>
                <option>Kartu Kredit</option>
                <option>GoPay / OVO / Dana</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleBayar}
              className="mt-4 w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500"
            >
              Bayar Sekarang
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}
