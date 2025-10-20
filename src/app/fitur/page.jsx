import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FiturPage() {
  const fitur = [
    {
      title: "⚡ Cepat & Responsif",
      desc: "Dibangun dengan performa tinggi menggunakan Next.js dan Tailwind CSS.",
    },
    {
      title: "🧩 Komponen Modular",
      desc: "Gunakan komponen siap pakai untuk mempercepat pengembangan aplikasi kamu.",
    },
    {
      title: "🎨 Desain Modern",
      desc: "UI yang elegan dan profesional, siap pakai untuk semua jenis proyek.",
    },
    {
      title: "☁️ Hosting Otomatis",
      desc: "Deploy ke server hanya dengan satu klik — tanpa konfigurasi manual.",
    },
    {
      title: "🔒 Keamanan Terjamin",
      desc: "Dilengkapi enkripsi dan autentikasi modern untuk melindungi data kamu.",
    },
    {
      title: "📊 SEO & Analytics",
      desc: "Optimasi SEO dan analisis real-time untuk perkembangan bisnis kamu.",
    },
  ];

  return (
    <main className="overflow-x-hidden">
      <Navbar />

      {/* Feature Section (Menggunakan semua data fitur dan menyesuaikan layout) */}
      <section className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center py-20 px-6">
        <h1 className="text-4xl font-bold mb-6">🚀 Fitur Unggulan</h1>
        <p className="max-w-3xl text-center text-gray-300 mb-10">
          Kami menyediakan berbagai fitur yang mempermudah pengembangan proyek Anda, 
          mulai dari desain siap pakai hingga integrasi AI otomatis.
        </p>

        {/* Features Grid - Diperluas untuk 6 item */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {fitur.map((f, i) => (
            <div 
              key={i} 
              className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:bg-gray-700 transition"
            >
              <h2 className="text-2xl font-semibold mb-2">{f.title}</h2>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}