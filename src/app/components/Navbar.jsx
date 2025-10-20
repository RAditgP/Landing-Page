"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md shadow-md text-gray-900"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-extrabold tracking-wide">
          DevLaunch 🚀
        </h1>

        <ul className="flex gap-6">
          <li><Link href="/" className="hover:text-blue-500">Beranda</Link></li>
          <li><Link href="/fitur" className="hover:text-blue-500">Fitur</Link></li>
          <li><Link href="/template" className="hover:text-blue-500">Template</Link></li>
          <li><Link href="/harga" className="hover:text-blue-500">Harga</Link></li>
          <li><Link href="/kontak" className="hover:text-blue-500">Kontak</Link></li>
        </ul>

        <button className="bg-blue-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
          Daftar Gratis
        </button>
      </div>
    </nav>
  );
}
