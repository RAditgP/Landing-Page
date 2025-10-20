import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HargaPage() {
  const plans = [
    { name: "Gratis", price: "Rp 0", features: ["Template dasar", "Akses fitur utama", "Support komunitas"] },
    { name: "Pro", price: "Rp 49.000/bulan", features: ["Semua fitur gratis", "Desain premium", "Support prioritas"] },
    { name: "Bisnis", price: "Rp 99.000/bulan", features: ["Fitur lengkap", "Integrasi API", "Custom domain & branding"] },
  ];

  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <section className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center py-20">
        <h1 className="text-4xl font-bold mb-8">💰 Paket Harga</h1>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl w-full px-6">
          {plans.map((p, i) => (
            <div key={i} className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:bg-gray-700 transition">
              <h2 className="text-2xl font-semibold mb-2">{p.name}</h2>
              <p className="text-3xl font-bold text-blue-400 mb-4">{p.price}</p>
              <ul className="text-gray-300 space-y-2">
                {p.features.map((f, j) => <li key={j}>✅ {f}</li>)}
              </ul>
              <button className="mt-6 w-full bg-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-700">
                Pilih Paket
              </button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
