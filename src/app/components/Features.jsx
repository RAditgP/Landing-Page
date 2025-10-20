import { Code, Zap, Shield, Cloud, Smartphone, Rocket } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Zap size={40} className="text-blue-600" />,
      title: "Cepat & Efisien",
      desc: "Dibangun dengan teknologi modern untuk memastikan performa website kamu maksimal dan loading super cepat.",
    },
    {
      icon: <Code size={40} className="text-purple-600" />,
      title: "Mudah Dikustomisasi",
      desc: "Semua elemen bisa kamu ubah dengan mudah tanpa perlu coding yang rumit — cocok untuk pemula maupun profesional.",
    },
    {
      icon: <Shield size={40} className="text-green-600" />,
      title: "Keamanan Terjamin",
      desc: "Setiap proyek dilengkapi dengan proteksi data dan enkripsi untuk menjaga privasi pengguna.",
    },
    {
      icon: <Cloud size={40} className="text-indigo-600" />,
      title: "Hosting Otomatis",
      desc: "Deploy website hanya dengan satu klik — langsung online tanpa konfigurasi server manual.",
    },
    {
      icon: <Smartphone size={40} className="text-pink-600" />,
      title: "Desain Responsif",
      desc: "Tampilan tetap keren di semua perangkat — dari desktop hingga smartphone.",
    },
    {
      icon: <Rocket size={40} className="text-orange-600" />,
      title: "SEO & Analytics",
      desc: "Optimasi SEO otomatis dan analisis pengunjung real-time untuk membantu kamu berkembang lebih cepat.",
    },
  ];

  return (
    <section id="fitur" className="py-20 bg-gray-50 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
          Fitur Unggulan DevLaunch 🚀
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Semua yang kamu butuhkan untuk membangun landing page modern — cepat,
          aman, dan mudah digunakan.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
