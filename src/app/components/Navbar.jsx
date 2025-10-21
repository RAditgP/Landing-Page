"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State baru untuk menu mobile

  // Efek untuk mengubah latar belakang saat scroll
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

  // Fungsi toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navClass = scrolled
    ? "bg-white/90 backdrop-blur-md shadow-lg text-gray-900"
    : "bg-transparent text-white";

  const linkClass = scrolled ? "hover:text-blue-600" : "hover:text-blue-400";

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Fitur", href: "/fitur" },
    { name: "Template", href: "/template" },
    { name: "Harga", href: "/harga" },
    { name: "Kontak", href: "/kontak" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navClass}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold tracking-wide">
          <Link href="/" className="hover:opacity-80">DevLaunch 🚀</Link>
        </h1>

        {/* Desktop Menu (Hidden on mobile) */}
        <ul className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className={linkClass}>
                {item.name}
              </Link>
            </li>
          ))}
          {/* Tombol CTA Desktop */}
          <Link href="/daftar">
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition ml-2">
              Daftar Gratis
            </button>
          </Link>
        </ul>

        {/* Mobile Toggle Button (Hidden on desktop) */}
        <div className="flex items-center md:hidden">
            {/* Tombol CTA Mobile (diletakkan di sini agar tetap terlihat) */}
            <Link href="/daftar" className="mr-4">
                <button className="bg-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition">
                    Daftar
                </button>
            </Link>

            <button onClick={toggleMenu} className="focus:outline-none">
                {/* Ikon Hamburger / Close */}
                {isOpen ? (
                    // Ikon Close (X)
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    // Ikon Hamburger
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                )}
            </button>
        </div>
      </div>

      {/* --- Mobile Menu Dropdown (Conditional Rendering) --- */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'
        } ${scrolled ? 'bg-white shadow-inner' : 'bg-gray-900/95'} border-t border-gray-700/50`}
      >
        <ul className="flex flex-col px-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href} 
                className={`block py-3 text-lg font-medium transition ${scrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'}`}
                onClick={() => setIsOpen(false)} // Tutup menu setelah klik
              >
                {item.name}
              </Link>
            </li>
          ))}
          {/* Tombol CTA Mobile (opsional, sudah ada di atas) */}
        </ul>
      </div>
    </nav>
  );
}