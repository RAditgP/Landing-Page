import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HargaPage() {
  const plans = [
    {
      name: "Gratis",
      price: "Rp 0",
      isPopular: false,
      features: [
        "Akses 3 Template Dasar",
        "Akses Fitur Utama",
        "Domain Sub-Default",
        "Dukungan Komunitas",
        "1 GB Bandwidth/Bulan",
      ],
      ctaText: "Mulai Gratis",
    },
    {
      name: "Pro",
      price: "Rp 49.000/bulan",
      isPopular: true, // Tetap gunakan marker popular untuk badge
      features: [
        "Semua Fitur Gratis",
        "Akses Semua Template Premium",
        "Dukungan Prioritas (Email)",
        "5 GB Bandwidth/Bulan",
        "Desain & Komponen Eksklusif",
        "Tanpa Watermark DevLaunch",
      ],
      ctaText: "Pilih Pro",
    },
    {
      name: "Bisnis",
      price: "Rp 99.000/bulan",
      isPopular: false,
      features: [
        "Fitur Lengkap Pro",
        "Custom Domain & Branding Penuh",
        "Integrasi API Pihak Ketiga",
        "Bandwidth Tak Terbatas",
        "SLA Uptime 99.9%",
        "Akun Pengguna Tim (3 User)",
      ],
      ctaText: "Pilih Bisnis",
    },
  ];

  return (
    <main className="overflow-x-hidden bg-gray-900 min-h-screen">
      <Navbar />

      <section className="text-white flex flex-col items-center py-16 sm:py-20 px-4 sm:px-6">
        {/* Judul dan Subjudul */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-center">
          💰 Harga yang Transparan
        </h1>
        <p className="max-w-3xl text-center text-gray-400 mb-12 sm:mb-16 text-base sm:text-lg px-2">
          Pilih paket yang paling sesuai dengan kebutuhan proyek atau bisnis Anda.
          Mulai dengan Gratis, *upgrade* kapan saja.
        </p>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl w-full">
          {plans.map((p, i) => (
            <div
              key={i}
              // Hapus semua kelas kondisional (isPopular) yang memberikan background biru default.
              // Tambahkan efek HOVER pada SEMUA kartu: bg-gray-700 -> bg-blue-600, scale dan shadow
              className={`p-6 sm:p-8 rounded-2xl transition duration-300 transform 
                bg-gray-800 shadow-xl 
                hover:bg-blue-600 hover:shadow-2xl hover:scale-100 lg:hover:scale-[1.05] 
                hover:border-2 hover:border-blue-400
              `}
            >
              {p.isPopular && (
                // Badge Paling Populer tetap ada untuk menyorot Pro
                <div className="text-sm font-bold bg-yellow-400 text-gray-900 px-3 py-1 rounded-full w-fit mb-3 -mt-2">
                  ✨ Paling Populer
                </div>
              )}
              
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{p.name}</h2>
              {/* Harga akan berwarna biru (blue-400) secara default, dan menjadi putih saat di-hover (diambil dari warna hover kartu) */}
              <p className={`text-3xl sm:text-4xl font-extrabold mb-4 text-blue-400`}>
                {p.price}
              </p>
              
              {/* Fitur List */}
              {/* text-gray-300 akan di-override oleh text-white dari hover:bg-blue-600 */}
              <ul className={`space-y-3 mb-8 text-gray-300`}>
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start text-sm sm:text-base">
                    <span className="mr-2 text-green-400 flex-shrink-0 mt-1">
                      {/* Ikon SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.329 8.354a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              
              {/* CTA Button */}
              <button 
                // Button akan memiliki warna default biru, dan menjadi kontras (putih) saat di-hover
                className={`mt-6 w-full py-3 rounded-lg font-bold text-lg transition shadow-md 
                  bg-blue-600 text-white hover:bg-white hover:text-blue-600
                `}
              >
                {p.ctaText}
              </button>
            </div>
          ))}
        </div>
      </section>
      
      {/* FAQ atau Penawaran Tambahan */}
      <section className="bg-gray-700 py-12 text-center text-white px-4 sm:px-6">
          <p className="text-lg sm:text-xl font-medium">
              Tidak yakin? <a href="/kontak" className="text-blue-400 hover:underline">Hubungi kami</a> untuk konsultasi paket bisnis.
          </p>
      </section>

      <Footer />
    </main>
  );
}