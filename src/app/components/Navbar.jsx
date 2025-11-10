"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// =================================================================
// 🔑 Komponen Ikon Profil Bulat
// =================================================================
const ProfileIcon = ({ name }) => {
  // Ambil inisial (misalnya, 'G' dari 'galih@gmail.com' atau 'GS' dari 'Galih Susanto')
  const initial = name ? name.toUpperCase().charAt(0) : 'U'; 
  
  return (
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md hover:bg-blue-700 transition">
      {initial}
    </div>
  );
};

export default function Navbar() {
  // State user dan loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State tampilan
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // ... (useEffect untuk handleScroll tetap sama) ...
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

  // Cek Status Login Saat Komponen Dimuat
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await fetch("/api/auth/status");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch login status:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkLoginStatus();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = async () => {
    try {
        const response = await fetch("/api/auth/logout", { method: "POST" });
        
        if (response.ok) {
            setUser(null); 
            window.location.href = '/login'; 
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
  };

  const navClass = scrolled
    ? "bg-white/90 backdrop-blur-md shadow-lg text-gray-900"
    : "bg-transparent text-white";

  const linkClass = scrolled ? "hover:text-blue-600" : "hover:text-blue-400";
  
  // Tentukan nama yang akan ditampilkan (untuk inisial)
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const isLoggedIn = !!user;

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Fitur", href: "/fitur" },
    { name: "Template", href: "/template" },
    { name: "Harga", href: "/harga" },
    { name: "Kontak", href: "/kontak" },
  ];

  if (loading) {
    // ... (Loading state tetap sama) ...
    return (
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navClass}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
              <h1 className="text-2xl font-extrabold tracking-wide">
                  <Link href="/" className="hover:opacity-80">DevLaunch 🚀</Link>
              </h1>
              <div className="h-4 w-20 bg-gray-500 rounded animate-pulse"></div>
          </div>
      </nav>
  ); 
  }

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
          
          {/* 🔑 PERUBAHAN: Ikon Profil & Logout Desktop */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-3 ml-2">
              {/* Tautan Profil/Dashboard menggunakan ikon bulat */}
              <Link 
                href="/profile" 
                className="flex items-center" 
                title={`profile ${displayName}`}
              >
                <ProfileIcon name={displayName} />
              </Link>
              
             
            </div>
          ) : (
            // Jika Belum Login: Daftar Gratis
            <Link href="/daftar">
              <button className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition ml-2">
                Daftar Gratis
              </button>
            </Link>
          )}
        </ul>

        {/* Mobile Toggle Button (Hidden on desktop) */}
        <div className="flex items-center md:hidden">
          {/* 🔑 PERUBAHAN: Ikon Profil & Logout Mobile */}
          {isLoggedIn ? (
            <>
              {/* Tautan Profil/Dashboard menggunakan ikon bulat */}
              <Link 
                href="/dashboard" 
                className="mr-4 flex items-center" 
                onClick={() => setIsOpen(false)}
              >
                <ProfileIcon name={displayName} />
              </Link>

              <button 
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold text-white hover:bg-red-700 transition mr-4"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/daftar" className="mr-4">
              <button className="bg-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition">
                Daftar
              </button>
            </Link>
          )}

          <button onClick={toggleMenu} className="focus:outline-none">
            {/* Ikon Hamburger / Close */}
            {/* ... (Ikon Hamburger/Close tetap sama) ... */}
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
        
        {/* --- Mobile Menu Dropdown --- */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'
          } ${scrolled ? 'bg-white shadow-inner' : 'bg-gray-900/95'} border-t border-gray-700/50`}
        >
          <ul className="flex flex-col px-6">
            {/* ... (Tautan navigasi tetap sama) ... */}
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href} 
                  className={`block py-3 text-lg font-medium transition ${scrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            {/* Opsi tambahan (Dashboard/Logout) untuk Mobile Menu Dropdown di sini jika diinginkan */}
          </ul>
        </div>
      </div>
    </nav>
  );
}