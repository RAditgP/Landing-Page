"use client";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HargaPage() {
  const router = useRouter();

  const plans = [
    {
      name: "Gratis",
      price: "Rp 0",
      ctaText: "Mulai Gratis",
      link: "/daftar",
      features: [
        "Akses fitur dasar",
        "Desain template terbatas",
        "1 proyek aktif",
        "Dukungan komunitas",
      ],
    },
    {
      name: "Pro",
      price: "Rp 49.000/bulan",
      ctaText: "Pilih Pro",
      link: "/pembayaran?plan=pro",
      features: [
        "Semua fitur Gratis",
        "Akses template premium",
        "5 proyek aktif",
        "Integrasi AI Otomatis",
        "Prioritas dukungan via chat",
      ],
    },
    {
      name: "Bisnis",
      price: "Rp 99.000/bulan",
      ctaText: "Pilih Bisnis",
      link: "/pembayaran?plan=bisnis",
      features: [
        "Semua fitur Pro",
        "Proyek tanpa batas",
        "Tim kolaborasi (hingga 10 anggota)",
        "Analitik performa proyek",
        "Dukungan 24/7 & konsultan pribadi",
      ],
    },
  ];

  return (
    <main className="overflow-x-hidden bg-gray-900 min-h-screen">
      <Navbar />
      <section className="text-white flex flex-col items-center py-16 sm:py-20 px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-center">
          💰 Harga yang Transparan
        </h1>
        <p className="max-w-3xl text-center text-gray-400 mb-12 sm:mb-16 text-base sm:text-lg px-2">
          Pilih paket yang paling sesuai dengan kebutuhan proyek Anda.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl w-full">
          {plans.map((p, i) => (
            <div
              key={i}
              className="bg-gray-800 p-8 rounded-2xl shadow-xl hover:bg-blue-600 hover:scale-105 transition duration-300"
            >
              <h2 className="text-2xl font-bold mb-2">{p.name}</h2>
              <p className="text-3xl font-extrabold text-blue-400 mb-4">
                {p.price}
              </p>

              <ul className="text-gray-300 mb-8 space-y-2">
                {p.features.map((f, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-green-400">✔</span> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push(p.link)}
                className="mt-6 w-full py-3 rounded-lg font-bold text-lg transition bg-blue-600 text-white hover:bg-white hover:text-blue-600"
              >
                {p.ctaText}
              </button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
