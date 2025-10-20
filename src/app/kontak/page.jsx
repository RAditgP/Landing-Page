import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function KontakPage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <section className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6 py-20">
        <h1 className="text-4xl font-bold mb-6">📞 Hubungi Kami</h1>
        <p className="text-gray-400 mb-8 text-center max-w-2xl">
          Punya pertanyaan, saran, atau ingin bekerja sama?  
          Kirim pesan melalui formulir di bawah ini, kami akan segera merespons.
        </p>

        <form className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg">
          <div className="mb-4">
            <label className="block mb-2">Nama</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Pesan</label>
            <textarea className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white outline-none" rows="5"></textarea>
          </div>
          <button className="bg-blue-600 w-full py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Kirim Pesan
          </button>
        </form>
      </section>
      <Footer />
    </main>
  );
}
