"use client";
import Link from "next/link";
import { useState } from "react";
// Import ikon dari lucide-react
import { Mail, Key, LogIn, UserPlus, Github, Globe } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // --- Logika Login Di Sini ---
    // (Misalnya, panggil API untuk autentikasi)
    
    setTimeout(() => {
        console.log(`Mencoba masuk dengan Email: ${email}`);
        // Ganti dengan logika autentikasi yang sebenarnya
        if (email === "test@devlaunch.com" && password === "password") {
             alert("Login Berhasil (Simulasi)! Selamat datang kembali.");
             // router.push('/dashboard'); 
        } else {
             alert("Login Gagal (Simulasi). Cek kembali email dan kata sandi Anda.");
        }
        setIsLoading(false);
    }, 1500);
  };

  return (
    // Gunakan bg-gray-900 di sini dan pt-24 agar tidak tertutup Navbar
    <div className="bg-gray-900 min-h-screen pt-24 pb-12 flex items-center justify-center p-4">
      
      {/* Container Utama Form */}
      <div className="w-full max-w-md bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl border border-gray-700">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LogIn size={36} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Masuk ke Akun Anda
          </h1>
          <p className="text-gray-400">
            Selamat datang kembali! Silakan masukkan detail Anda.
          </p>
        </div>

        {/* Opsi Login Cepat (Social Login) */}
        <div className="flex flex-col gap-3 mb-6">
          <button className="w-full flex items-center justify-center bg-white hover:bg-gray-200 text-gray-900 font-semibold py-2.5 px-4 rounded-lg transition duration-200 border border-gray-300">
            <Globe size={20} className="mr-2" />
            Masuk dengan Google
          </button>
          
          <button className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 border border-gray-600">
            <Github size={20} className="mr-2" />
            Masuk dengan GitHub
          </button>
        </div>
        
        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">ATAU</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Form Login Email */}
        <form onSubmit={handleLogin}>
          {/* Input Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
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

          {/* Input Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              <Key size={16} className="inline mr-1 text-blue-400" /> Kata Sandi
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

          {/* Opsi Lupa Kata Sandi */}
          <div className="flex justify-end mb-6">
            <Link href="/lupa-sandi" className="text-sm text-blue-400 hover:text-blue-300 transition">
              Lupa Kata Sandi?
            </Link>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses...' : 'Masuk ke Akun'}
          </button>
        </form>

        {/* Footer Form */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun? 
          <Link href="/daftar" className="text-green-400 hover:text-green-300 font-medium ml-1 transition flex items-center justify-center mt-2">
             <UserPlus size={16} className="inline mr-1" /> Daftar Gratis
          </Link>
        </p>
      </div>
    </div>
  );
}