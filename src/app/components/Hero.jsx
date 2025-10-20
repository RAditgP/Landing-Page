export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-50 to-blue-100 text-center px-4">
      <h1 className="text-5xl font-bold mb-4 text-blue-700">Selamat Datang di Website Kami</h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-8">
        Kami membantu bisnis Anda berkembang dengan solusi digital yang modern dan efisien.
      </p>
      <div>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Mulai Sekarang
        </button>
      </div>
    </section>
  );
}
