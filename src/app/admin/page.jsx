export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8 text-white">
        Dashboard Admin ✨
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-indigo-500 transition">
          <h2 className="text-gray-300 font-medium">Jumlah Template</h2>
          <p className="text-4xl font-bold text-indigo-400 mt-3">12</p>
        </div>

        <div className="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-indigo-500 transition">
          <h2 className="text-gray-300 font-medium">User Aktif</h2>
          <p className="text-4xl font-bold text-indigo-400 mt-3">5</p>
        </div>

        <div className="bg-[#1e293b] border border-gray-700 rounded-2xl p-6 shadow-lg hover:border-indigo-500 transition">
          <h2 className="text-gray-300 font-medium">Kunjungan Hari Ini</h2>
          <p className="text-4xl font-bold text-indigo-400 mt-3">28</p>
        </div>
      </div>

      <footer className="mt-12 text-gray-500 text-sm border-t border-gray-700 pt-6">
        © 2025 DevLaunch. Dibangun dengan ❤️ oleh Tim Rayyan.
      </footer>
    </div>
  );
}
