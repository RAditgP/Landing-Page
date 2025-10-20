import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TemplatePage() {
  const templates = [
    {
      name: "Portfolio Profesional",
      desc: "Cocok untuk personal branding, CV digital, dan showcase project terbaik Anda.",
      imagePlaceholder: "bg-gradient-to-tr from-purple-400 to-indigo-500", 
      tag: "Populer", 
      category: "Personal",
      useUrl: "/checkout?template=portfolio-pro", // URL simulasi untuk penggunaan
      demoUrl: "/demo/portfolio-pro", 
    },
    {
      name: "Landing Page Startup",
      desc: "Ideal untuk produk digital baru, promosi event, atau mengumpulkan leads dengan cepat.",
      imagePlaceholder: "bg-gradient-to-tr from-green-400 to-teal-500",
      tag: "Baru",
      category: "Bisnis",
      useUrl: "/checkout?template=landing-startup",
      demoUrl: "/demo/landing-startup",
    },
    {
      name: "Dashboard Admin",
      desc: "Template profesional dan fungsional untuk aplikasi internal, CMS, atau CRM.",
      imagePlaceholder: "bg-gradient-to-tr from-red-400 to-pink-500",
      tag: null,
      category: "Aplikasi",
      useUrl: "/checkout?template=dashboard-admin",
      demoUrl: "/demo/dashboard-admin",
    },
    {
      name: "E-Commerce Minimalis",
      desc: "Desain bersih dan modern yang fokus pada konversi produk dan pengalaman belanja.",
      imagePlaceholder: "bg-gradient-to-tr from-yellow-400 to-orange-500",
      tag: null,
      category: "Bisnis",
      useUrl: "/checkout?template=ecommerce-mini",
      demoUrl: "/demo/ecommerce-mini",
    },
    {
        name: "Blog Teknologi",
        desc: "Layout yang ringan dan fokus pada pembacaan konten dengan optimasi SEO.",
        imagePlaceholder: "bg-gradient-to-tr from-blue-400 to-cyan-500",
        tag: null,
        category: "Personal",
        useUrl: "/checkout?template=blog-tech",
        demoUrl: "/demo/blog-tech",
    },
    {
        name: "Website Event",
        desc: "Halaman pendaftaran dan informasi untuk seminar, webinar, atau konferensi.",
        imagePlaceholder: "bg-gradient-to-tr from-pink-400 to-rose-500",
        tag: "Baru",
        category: "Lainnya",
        useUrl: "/checkout?template=website-event",
        demoUrl: "/demo/website-event",
    },
  ];

  const categories = ["Semua", "Personal", "Bisnis", "Aplikasi", "Lainnya"];
  const selectedCategory = "Semua"; 

  const testimonials = [
    { quote: "Template DevLaunch sangat menghemat waktu! Desainnya modern dan mudah di kustomisasi.", author: "Susi W., Freelancer" },
    { quote: "Sangat responsif dan cepat. Website startup kami berhasil naik dalam 30 menit.", author: "Bima H., CTO Startup" },
    { quote: "Pilihan kategorinya banyak dan terstruktur. Akhirnya ketemu template dashboard yang pas.", author: "Ayu P., Project Manager" },
  ];

  return (
    <main className="overflow-x-hidden bg-gray-900 min-h-screen">
      <Navbar />

      <section className="text-white flex flex-col items-center px-6 py-20">
        <h1 className="text-5xl font-extrabold mb-4 text-center">
          🎨 Koleksi <span className="text-blue-400">Template</span> Terbaik
        </h1>
        <p className="max-w-3xl text-center text-gray-400 mb-12 text-lg">
          Pilih dari template siap pakai kami. Desain responsif dan modern,
          siap diluncurkan dalam hitungan menit.
        </p>

        {/* --- Bagian Filter/Kategori --- */}
        <div className="flex flex-wrap justify-center gap-3 max-w-7xl w-full mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition 
                ${cat === selectedCategory 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* --- End Filter/Kategori --- */}

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl w-full">
          {templates.map((t, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col hover:scale-[1.02] hover:shadow-blue-500/30 transition duration-300 border border-gray-700"
            >
              {/* Image Placeholder */}
              <div
                className={`h-48 w-full ${t.imagePlaceholder} flex items-center justify-center text-gray-900 font-bold text-lg`}
              >
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
                  {/* Perubahan di sini: Mengganti <button> menjadi <a> */}
                  <a 
                    href={t.useUrl} // Menggunakan URL tujuan dari data template
                    className="bg-blue-600 px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Gunakan Template
                  </a>
                  <a href={t.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm font-semibold hover:text-blue-300">
                    Demo Live →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* --- Bagian Testimonial (Social Proof) --- */}
      <section className="bg-gray-800 py-16 px-6 text-white border-t border-b border-gray-700">
          <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Apa Kata Pengguna Kami?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((t, i) => (
                      <div key={i} className="bg-gray-900 p-6 rounded-xl border border-gray-700 shadow-xl">
                          <p className="text-xl italic text-gray-300 mb-4">
                              "{t.quote}"
                          </p>
                          <p className="text-blue-400 font-semibold">- {t.author}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      

      {/* CTA Section (Paling Bawah) */}
      <section className="bg-gray-900 py-16 text-center text-white">
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