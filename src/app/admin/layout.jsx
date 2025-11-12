"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, FolderKanban, Mail, Menu, X } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Kelola Template",
      href: "/admin/templates",
      icon: <FolderKanban size={18} />,
    },
    {
      name: "Pesan Masuk",
      href: "/admin/pesan",
      icon: <Mail size={18} />,
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      {/* ====================== */}
      {/* 📱 Sidebar (Mobile) */}
      {/* ====================== */}
      <div
        className={`fixed inset-0 bg-black/40 z-20 md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* ====================== */}
      {/* 🧭 Sidebar */}
      {/* ====================== */}
      <aside
        className={`fixed md:static z-30 bg-[#1e293b] text-white w-64 min-h-screen p-5 transition-transform duration-300 border-r border-gray-700 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            <span className="text-indigo-400">DevLaunch</span> 🚀
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                  active
                    ? "bg-indigo-600 text-white shadow-md"
                    : "hover:bg-indigo-500/30 text-gray-300 hover:text-white"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer info kecil */}
        <div className="absolute bottom-5 left-5 text-xs text-gray-400">
          v1.0 • Admin Panel
        </div>
      </aside>

      {/* ====================== */}
      {/* 🧠 Main Content */}
      {/* ====================== */}
      <main className="flex-1 flex flex-col">
        {/* 🔝 Top Bar */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              Admin Dashboard
            </h2>
          </div>
          <div className="text-sm text-gray-500">Welcome, Rayyan 👋</div>
        </header>

        {/* 💼 Main Children Content */}
        <div className="p-8 bg-gray-50 flex-1">{children}</div>
      </main>
    </div>
  );
}
