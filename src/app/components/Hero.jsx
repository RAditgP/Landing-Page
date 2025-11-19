"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export default function Hero() {
  return (
    <section
      id="home"
      className="flex flex-col lg:flex-row items-center pt-32 pb-16 lg:py-0 min-h-screen bg-gray-900 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* KOLOM KIRI */}
        <div className="text-center lg:text-left">
          <span className="inline-block bg-blue-600/30 text-blue-300 text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-blue-500/50">
            🔥 Peluncuran Terbaru
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            Buat Website Modern <br className="hidden md:inline"/> Lebih{" "}
            <span className="text-blue-400">Cepat & Efisien</span>
          </h1>

          <p className="text-lg text-gray-400 mb-8 max-w-xl lg:max-w-none mx-auto lg:mx-0">
            DevLaunch menyediakan koleksi template siap pakai dan *tool* untuk membangun *landing page* profesional dalam hitungan menit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-4">
            <a href="/daftar" className="inline-block">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 w-full sm:w-auto">
                Mulai Gratis Sekarang
              </button>
            </a>
            <a href="/demo" className="inline-block">
              <button 
                className="border border-white/50 bg-transparent text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/10 transition w-full sm:w-auto"
              >
                Lihat Demo Template
              </button>
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Gabung dengan 500+ bisnis yang sudah menghemat waktu dengan DevLaunch.
          </p>
        </div>
        
        {/* KOLOM KANAN — SLIDER MOCKUP 16:9 (AREA YANG DIMODIFIKASI) */}
        <div className="mt-12 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl lg:max-w-2xl">
                
                {/* Glow Effect (Tetap Ada) */}
                <div className="absolute inset-0 bg-blue-500/40 rounded-3xl blur-3xl opacity-60 z-0 animate-pulse-slow"></div>

                {/* Container Utama Mockup: bg-transparent p-0 untuk menghilangkan latar belakang hitam */}
                <div className="relative **bg-transparent p-0** rounded-3xl shadow-[0_25px_60px_rgba(30,144,255,0.7)] border border-blue-500/30 transform hover:scale-[1.01] transition duration-300">

                    {/* Title Mockup */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-lg whitespace-nowrap z-10">
                        Perkenalan Template DevLaunch
                    </div>

                    {/* Area Swiper (Gambar): Menggunakan rounded-3xl dan border tebal sebagai bingkai */}
                    <div className="w-full aspect-video overflow-hidden **rounded-3xl** border-4 border-gray-600/50">
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }} 
                            loop={true}
                            className="w-full h-full"
                        >
                            <SwiperSlide>
                                <img 
                                    src="/mockups/mockup1.png"
                                    alt="Demo Template 1"
                                    className="w-full h-full object-cover"
                                />
                            </SwiperSlide>

                            <SwiperSlide>
                                <img 
                                    src="/mockups/mockup2.png"
                                    alt="Demo Template 2"
                                    className="w-full h-full object-cover"
                                />
                            </SwiperSlide>

                            <SwiperSlide>
                                <img 
                                    src="/mockups/mockup3.png"
                                    alt="Demo Template 3"
                                    className="w-full h-full object-cover"
                                />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                    
                    {/* Indikator kamera/dot di bagian atas container */}
                    <div className="absolute top-4 left-4 flex space-x-1 z-20">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </section>
  );
}