export default function Hero() {
  return (
    <section
      id="home"
      className="flex flex-col justify-center items-center text-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white"
    >
      <div className="max-w-3xl">
        <h1 className="text-6xl font-extrabold leading-tight mb-6">
          Buat Website Modern <br /> Lebih Cepat dan Efisien
        </h1>
        <p className="text-lg text-gray-100 mb-8">
          Dengan <span className="font-semibold">DevLaunch</span>, kamu bisa membangun landing page profesional hanya dalam hitungan menit.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
            Coba Sekarang
          </button>
          <button className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition">
            Lihat Demo
          </button>
        </div>
      </div>
    </section>
  );
}
