import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function KontakPage() {
  const contactInfo = [
    { 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email Kami",
      value: "support@devlaunch.com",
      link: "mailto:support@devlaunch.com",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Telepon",
      value: "+62 812-3456-7890",
      link: "tel:+6281234567890",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Kantor Pusat",
      value: "Jakarta, Indonesia",
      link: "#",
    },
  ];

  return (
    <main className="overflow-x-hidden bg-gray-900 min-h-screen">
      <Navbar />

      <section className="text-white flex flex-col items-center px-4 sm:px-6 py-20">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-center">
          📞 Hubungi <span className="text-blue-400">Tim Kami</span>
        </h1>
        <p className="text-gray-400 mb-12 text-center max-w-3xl text-lg">
          Kami siap menjawab pertanyaan Anda, mulai dari dukungan teknis hingga potensi kolaborasi bisnis.
        </p>

        {/* --- Layout Utama (2 Kolom di Desktop) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl">
          
          {/* KOLOM KIRI: Informasi Kontak */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold border-b border-gray-700 pb-4 mb-4">Informasi Kontak</h2>
            <p className="text-gray-400 text-lg">
              Anda bisa menghubungi kami melalui opsi di bawah ini atau mengisi formulir di samping.
            </p>

            <div className="space-y-6">
              {contactInfo.map((item, i) => (
                <a 
                  key={i} 
                  href={item.link}
                  className="flex items-center p-4 bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition"
                >
                  <div className="p-3 rounded-full bg-blue-600/20 mr-4">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-blue-400 font-medium">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* KOLOM KANAN: Formulir Kontak */}
          <div className="lg:p-8">
            <h2 className="text-3xl font-bold mb-6">Kirim Pesan Langsung</h2>
            <form className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
              
              {/* Field Nama */}
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">Nama Lengkap</label>
                <input 
                  type="text" 
                  id="name"
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 transition duration-150 focus:ring-2 focus:ring-blue-500 focus:bg-gray-700 border-gray-600 outline-none" 
                  required 
                />
              </div>

              {/* Field Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">Alamat Email</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 transition duration-150 focus:ring-2 focus:ring-blue-500 focus:bg-gray-700 border-gray-600 outline-none" 
                  required 
                />
              </div>

              {/* Field Pesan */}
              <div className="mb-8">
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">Pesan Anda</label>
                <textarea 
                  id="message"
                  placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 transition duration-150 focus:ring-2 focus:ring-blue-500 focus:bg-gray-700 border-gray-600 outline-none" 
                  rows="5"
                  required
                ></textarea>
              </div>

              {/* Tombol Submit */}
              <button 
                type="submit"
                className="bg-blue-600 w-full py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}