"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// =================================================================
// 🔑 Komponen Ikon Profil Bulat
// =================================================================
const ProfileIcon = ({ name }) => {
  const initial = name ? name.toUpperCase().charAt(0) : "U";

  return (
    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md hover:bg-blue-700 transition">
      {initial}
    </div>
  );
};

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cek login
  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const res = await fetch("/api/auth/status");

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error(e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkLoginStatus();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        setUser(null);
        window.location.href = "/login";
      }
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const navClass = scrolled
    ? "bg-white/90 backdrop-blur-md shadow-lg text-gray-900"
    : "bg-transparent text-white";

  const linkClass = scrolled ? "hover:text-blue-600" : "hover:text-blue-400";

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const isLoggedIn = !!user;

  const navItems = [
    { name: "Beranda", href: "/" },
    { name: "Fitur", href: "/fitur" },
    { name: "Template", href: "/template" },
    { name: "Harga", href: "/harga" },
    { name: "Kontak", href: "/kontak" },
  ];

  if (loading) {
    return (
      <nav className={`fixed top-0 w-full z-50 ${navClass}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-extrabold tracking-wide">
            <Link href="/">DevLaunch 🚀</Link>
          </h1>
          <div className="h-4 w-20 bg-gray-400 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all ${navClass}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide">
          DevLaunch 🚀
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className={linkClass}>
                {item.name}
              </Link>
            </li>
          ))}

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <ProfileIcon name={displayName} />
              </Link>
            </div>
          ) : (
            <Link href="/daftar">
              <button className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700">
                Daftar Gratis
              </button>
            </Link>
          )}
        </ul>

        {/* MOBILE HEADER (profile + toggle button) */}
        <div className="md:hidden flex items-center gap-3">
          {isLoggedIn && (
            <Link href="/dashboard">
              <ProfileIcon name={displayName} />
            </Link>
          )}

          {!isLoggedIn && (
            <Link href="/daftar">
              <button className="bg-blue-600 px-3 py-1.5 text-sm rounded-lg text-white hover:bg-blue-700">
                Daftar
              </button>
            </Link>
          )}

          {/* TOGGLE */}
          <button onClick={toggleMenu}>
            {isOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor">
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ========================== */}
      {/*        MOBILE DROPDOWN      */}
      {/* ========================== */}
      <div
        className={`md:hidden transition-all overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } ${scrolled ? "bg-white" : "bg-gray-900/95"} shadow-md`}
      >
        <ul className="flex flex-col px-6 pb-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block py-3 text-lg ${
                  scrolled
                    ? "text-gray-900 hover:text-blue-600"
                    : "text-white hover:text-blue-400"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}

          {isLoggedIn && (
            <>
              <hr className="border-gray-700/40 my-2" />

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="text-left py-3 text-red-600 font-semibold text-lg"
              >
                Logout
              </button>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
