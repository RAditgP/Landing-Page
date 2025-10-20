import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TemplatePage() {
  const templates = [
    { name: "Portfolio", desc: "Cocok untuk personal branding dan showcase project." },
    { name: "Landing Page", desc: "Ideal untuk startup, produk digital, atau promosi event." },
    { name: "Dashboard Admin", desc: "Template profesional untuk aplikasi internal atau CRM." },
  ];

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <section className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-20">
        <h1 className="text-4xl font-bold mb-8">🎨 Koleksi Template</h1>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl w-full">
          {templates.map((t, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:bg-gray-700 transition">
              <h2 className="text-2xl font-semibold mb-2">{t.name}</h2>
              <p className="text-gray-400">{t.desc}</p>
              <button className="mt-4 bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                Lihat Template
              </button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
