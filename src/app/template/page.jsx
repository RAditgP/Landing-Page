"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Komponen Card sederhana untuk menampilkan satu template (perlu dibuat terpisah)
const TemplateCard = ({ template }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-4 transition duration-300 hover:scale-[1.02]">
    <div className="h-48 bg-gray-700 rounded-md mb-4 flex items-center justify-center text-gray-400">
      {template.image ? (
        <img
          src={template.image}
          alt={template.name}
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <span>Image Placeholder</span>
      )}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-indigo-400 border border-indigo-400 rounded-full px-3 py-1">
        {template.category}
      </span>
      <a
        href={template.demoUrl || template.useUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-400 hover:text-indigo-300 transition duration-150"
      >
        Lihat Detail &rarr;
      </a>
    </div>
  </div>
);

export default function TemplatePage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const [error, setError] = useState(null); // Tambahkan state error
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const categories = ["Semua", "Personal", "Bisnis", "Aplikasi", "Lainnya"];

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setTemplates(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setError("Gagal memuat template. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const filteredTemplates =
    selectedCategory === "Semua"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <main className="overflow-x-hidden bg-gray-900 min-h-screen">
      <Navbar />

      <header className="py-20 text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Galeri Template Profesional
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Pilih template terbaik yang dibangun dengan Next.js dan Tailwind CSS
          untuk proyek Anda.
        </p>
      </header>

      <section className="container mx-auto px-4 py-8">
        {/* Kontrol Filter Kategori */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition duration-300 ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Status Loading/Error */}
        {loading && (
          <p className="text-center text-xl text-indigo-400">
            Memuat template...
          </p>
        )}
        {error && (
          <p className="text-center text-xl text-red-500">
            🚨 {error}
          </p>
        )}

        {/* Daftar Template */}
        {!loading && !error && (
          <>
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <p className="text-center text-xl text-gray-400">
                Tidak ada template ditemukan untuk kategori "{selectedCategory}".
              </p>
            )}
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}