import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TemplatePage() {
  const templates = [
    {
      name: "Portfolio Profesional",
      desc: "Cocok untuk personal branding, CV digital, dan showcase project terbaik Anda.",
      imagePlaceholder: "bg-gradient-to-tr from-purple-400 to-indigo-500", // Placeholder untuk gambar
      tag: "Populer", // Tag baru
    },
    {
      name: "Landing Page Startup",
      desc: "Ideal untuk produk digital baru, promosi event, atau mengumpulkan leads dengan cepat.",
      imagePlaceholder: "bg-gradient-to-tr from-green-400 to-teal-500",
      tag: "Baru",
    },
    {
      name: "Dashboard Admin",
      desc: "Template profesional dan fungsional untuk aplikasi internal, CMS, atau CRM.",
      imagePlaceholder: "bg-gradient-to-tr from-red-400 to-pink-500",
      tag: null,
    },
    {
      name: "E-Commerce Minimalis",
      desc: "Desain bersih dan modern yang fokus pada konversi produk dan pengalaman belanja.",
      imagePlaceholder: "bg-gradient-to-tr from-yellow-400 to-orange-500",
      tag: null,
    },
  ];

  return (
    <main className="overflow-x-hidden bg-gray-900 min-h-screen">
      <Navbar />

      <section className="text-white flex flex-col items-center px-6 py-20">
        <h1 className="text-5xl font-extrabold mb-4 text-center">
          🎨 Koleksi <span className="text-blue-400">Template</span> Terbaik
        </h1>
        <p className="max-w-3xl text-center text-gray-400 mb-16 text-lg">
          Pilih dari template siap pakai kami. Desain responsif dan modern,
          siap diluncurkan dalam hitungan menit.
        </p>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl w-full">
          {templates.map((t, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col hover:scale-[1.02] hover:shadow-blue-500/30 transition duration-300 border border-gray-700"
            >
              {/* Image Placeholder (Elemen visual wajib) */}
              <div
                className={`h-48 w-full ${t.imagePlaceholder} flex items-center justify-center text-gray-900 font-bold text-lg`}
              >
                {/* Anda bisa ganti ini dengan komponen Image nyata */}
                Preview Template
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                {t.tag && (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full w-fit mb-2 ${
                      t.tag === "Populer"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {t.tag}
                  </span>
                )}
                <h2 className="text-2xl font-bold mb-2 text-white">{t.name}</h2>
                <p className="text-gray-400 mb-4 flex-grow">{t.desc}</p>
                
                {/* Button Section */}
                <div className="flex justify-between items-center mt-4">
                  <button className="bg-blue-600 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                    Gunakan Template
                  </button>
                  <a href="#" className="text-blue-400 text-sm font-semibold hover:text-blue-300">
                    Demo Live →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Untuk mendorong tindakan */}
      <section className="bg-gray-800 py-16 text-center text-white border-t border-gray-700">
        <h2 className="text-3xl font-bold mb-4">
          Siap Menciptakan Website Impian Anda?
        </h2>
        <p className="text-lg text-gray-400 mb-8">
          Mulai jelajahi semua template premium secara gratis!
        </p>
        <a
          href="/daftar"
          className="bg-green-500 text-gray-900 px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-green-400 transition transform hover:-translate-y-0.5"
        >
          Mulai Sekarang
        </a>
      </section>

      <Footer />
    </main>
  );
}