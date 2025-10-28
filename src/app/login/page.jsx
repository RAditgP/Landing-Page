"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Key, LogIn, UserPlus, Github, Globe } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login gagal");

      alert(`✅ ${data.message} — Selamat datang, ${data.user.email}!`);

      // Simpan user di localStorage (opsional)
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect ke halaman utama setelah login sukses
      router.push("/");
    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <LogIn size={36} className="mx-auto text-green-400 mb-3" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Masuk ke Akun Anda
          </h1>
          <p className="text-gray-400 text-sm">
            Selamat datang kembali! Silakan masukkan detail Anda.
          </p>
        </div>

        {/* Login Sosial */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            type="button"
            className="w-full flex items-center justify-center bg-white hover:bg-gray-200 text-gray-900 font-semibold py-2.5 rounded-lg transition border border-gray-300"
          >
            <Globe size={20} className="mr-2" />
            Masuk dengan Google
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition border border-gray-600"
          >
            <Github size={20} className="mr-2" />
            Masuk dengan GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-500 text-sm">ATAU</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              <Mail size={16} className="inline mr-1 text-blue-400" />
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="nama@email.com"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              <Key size={16} className="inline mr-1 text-blue-400" />
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Masukkan kata sandi Anda"
            />
          </div>

          <div className="flex justify-end mb-6">
            <Link
              href="/lupa-sandi"
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              Lupa Kata Sandi?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses..." : "Masuk ke Akun"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?
          <Link
            href="/daftar"
            className="text-green-400 hover:text-green-300 font-medium ml-1 transition inline-flex items-center"
          >
            <UserPlus size={16} className="inline mr-1" /> Daftar Gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
