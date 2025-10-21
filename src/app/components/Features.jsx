import { Code, Zap, Shield, Cloud, Smartphone, Rocket } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Zap size={40} className="text-blue-400" />,
      title: "Cepat & Efisien",
      desc: "Dibangun dengan teknologi modern untuk memastikan performa website kamu maksimal dan loading super cepat.",
      color: "blue",
    },
    {
      icon: <Code size={40} className="text-purple-400" />,
      title: "Mudah Dikustomisasi",
      desc: "Semua elemen bisa kamu ubah dengan mudah tanpa perlu coding yang rumit — cocok untuk pemula maupun profesional.",
      color: "purple",
    },
    {
      icon: <Shield size={40} className="text-green-400" />,
      title: "Keamanan Terjamin",
      desc: "Setiap proyek dilengkapi dengan proteksi data dan enkripsi untuk menjaga privasi pengguna.",
      color: "green",
    },
    {
      icon: <Cloud size={40} className="text-indigo-400" />,
      title: "Hosting Otomatis",
      desc: "Deploy website hanya dengan satu klik — langsung online tanpa konfigurasi server manual.",
      color: "indigo",
    },
    {
      icon: <Smartphone size={40} className="text-pink-400" />,
      title: "Desain Responsif",
      desc: "Tampilan tetap keren di semua perangkat — dari desktop hingga smartphone.",
      color: "pink",
    },
    {
      icon: <Rocket size={40} className="text-orange-400" />,
      title: "SEO & Analytics",
      desc: "Optimasi SEO otomatis dan analisis pengunjung real-time untuk membantu kamu berkembang lebih cepat.",
      color: "orange",
    },
  ];

  // Fungsi untuk mendapatkan warna hover border berdasarkan warna fitur
  const getHoverBorderClass = (color) => {
    switch (color) {
      case "blue": return "hover:border-blue-500/50";
      case "purple": return "hover:border-purple-500/50";
      case "green": return "hover:border-green-500/50";
      case "indigo": return "hover:border-indigo-500/50";
      case "pink": return "hover:border-pink-500/50";
      case "orange": return "hover:border-orange-500/50";
      default: return "";
    }
  };

  return (
    <section id="fitur" className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase text-blue-400 tracking-wider mb-2">
                Mengapa DevLaunch?
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Didesain untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Kreator Modern</span>
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto text-lg">
              Semua yang kamu butuhkan untuk membangun landing page modern — **cepat,
              aman, dan mudah digunakan** — fokus pada pertumbuhan, bukan setup.
            </p>
        </div>

        {/* --- Features Grid --- */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((item, index) => (
            <div
              key={index}
              className={`
                bg-gray-800 p-8 rounded-xl shadow-2xl transition duration-500 
                transform hover:-translate-y-1 border border-gray-700
                ${getHoverBorderClass(item.color)}
                hover:shadow-xl hover:shadow-${item.color}-500/20
              `}
            >
              {/* Icon Container */}
              <div 
                className={`flex justify-center mb-6 w-16 h-16 rounded-full bg-gray-700/50 items-center mx-auto transition-colors duration-300`}
              >
                  {item.icon}
              </div>
              
              {/* Text Content */}
              <h3 className="text-2xl font-bold mb-3 text-white text-center">
                {item.title}
              </h3>
              <p className="text-gray-400 text-base text-center">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}