export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] min-h-screen p-6 border-r border-gray-700">
        <h1 className="text-2xl font-bold mb-8">
          <span className="text-indigo-400">DevLaunch</span> 🚀
        </h1>

        <nav className="space-y-3">
          <a
            href="/admin"
            className="block py-2 px-3 rounded hover:bg-indigo-600 transition font-medium"
          >
            Dashboard
          </a>
          <a
            href="/admin/templates"
            className="block py-2 px-3 rounded hover:bg-indigo-600 transition font-medium"
          >
            Kelola Template
          </a>
        </nav>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
