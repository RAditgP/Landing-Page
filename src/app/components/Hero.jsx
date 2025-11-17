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
              <button className="border border-white/50 bg-transparent text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/10 transition w-full sm:w-auto">
                Lihat Demo Template
              </button>
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Gabung dengan 500+ bisnis yang sudah menghemat waktu dengan DevLaunch.
          </p>
        </div>
        
        {/* KOLOM KANAN — SLIDER MOCKUP 16:9 */}
        <div className="mt-12 lg:mt-0 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-xl lg:max-w-2xl">
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-3xl opacity-50 z-0"></div>

            {/* Container */}
            <div className="relative bg-gray-700 p-6 rounded-3xl shadow-[0_20px_50px_rgba(30,144,255,0.5)] border border-gray-600">

              <div className="w-full aspect-video overflow-hidden rounded-2xl">
                <Swiper
                  modules={[Pagination, Autoplay]}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  loop={true}
                  className="w-full h-full"
                >
                  <SwiperSlide>
                    <img 
                      src="/mockups/mockup1.png"
                      alt="Mockup 1"
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <img 
                      src="/mockups/mockup2.png"
                      alt="Mockup 2"
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>

                  <SwiperSlide>
                    <img 
                      src="/mockups/mockup3.png"
                      alt="Mockup 3"
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                </Swiper>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
