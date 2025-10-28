"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Tambahkan ini
import { Mail, Key, UserPlus, LogIn, Github, Globe } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter(); // ✅ Router untuk redirect
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🔹 Kirim data ke API register
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mendaftar");

      alert("✅ Pendaftaran Berhasil! Silakan login.");

      // 🔹 Redirect ke halaman login
      router.push("/login");

    } catch (err) {
      alert(`❌ ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen pt-24 pb-12 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <UserPlus size={36} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Mulai Gratis dengan DevLaunch
          </h1>
          <p className="text-gray-400">
            Daftar sekarang dan nikmati semua fitur dasar.
          </p>
        </div>

        {/* Social Login */}
        <div className="flex flex-col gap-3 mb-6">
          <button className="w-full flex items-center justify-center bg-white hover:bg-gray-200 text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition duration-200 border border-gray-300">
            <Globe size={20} className="mr-2" />
            Daftar dengan Google
          </button>

          <button className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 border border-gray-600">
            <Github size={20} className="mr-2" />
            Daftar dengan GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">ATAU</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Form Email/Password */}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              <Mail size={16} className="inline mr-1 text-blue-400" /> Alamat Email
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

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              <Key size={16} className="inline mr-1 text-blue-400" /> Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-gray-900 font-bold py-3 rounded-lg shadow-lg hover:bg-green-400 transition duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses..." : "Buat Akun DevLaunch"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition flex items-center justify-center mt-2"
          >
            <LogIn size={16} className="inline mr-1" /> Masuk di sini
          </Link>
        </p>

        <p className="text-center text-xs text-gray-600 mt-4 px-4">
          Dengan mendaftar, Anda setuju dengan
          <Link href="/syarat" className="text-blue-500 hover:underline mx-1">
            Syarat & Ketentuan
          </Link>
          dan
          <Link href="/privasi" className="text-blue-500 hover:underline mx-1">
            Kebijakan Privasi
          </Link>
          kami.
        </p>
      </div>
    </div>
  );
}
