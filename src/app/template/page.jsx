"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Komponen Card sederhana untuk menampilkan satu template (perlu dibuat terpisah)
const TemplateCard = ({ template }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-4 transition duration-300 hover:scale-[1.02]">
    <div className="h-48 bg-gray-700 rounded-md mb-4 flex items-center justify-center text-gray-400">
      {/* Ganti dengan tag <img /> yang sebenarnya */}
          </div>
    <h3 className="text-xl font-semibold text-white mb-2">{template.name}</h3>
    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-indigo-400 border border-indigo-400 rounded-full px-3 py-1">
        {template.category}
      </span>
      <a
        href={template.link || "#"}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const categories = ["Semua", "Personal", "Bisnis", "Aplikasi", "Lainnya"];

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setTemplates(data);
        setError(null);
      } catch (err) {
        console.error("❌ Gagal memuat template:", err);
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
    <main className="overflow-x-hidden bg-[#0f172a] min-h-screen text-white">
      <Navbar />

      {/* Header */}
      <header className="py-20 text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Galeri Template Profesional
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Pilih template terbaik yang dibangun dengan Next.js dan Tailwind CSS untuk proyek Anda.
        </p>
      </header>

      {/* Kategori */}
      <section className="container mx-auto px-6 pb-16">
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition duration-300 ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Status */}
        {loading && (
          <p className="text-center text-lg text-indigo-400">Memuat template...</p>
        )}
        {error && (
          <p className="text-center text-lg text-red-500">🚨 {error}</p>
        )}

        {/* Grid Template */}
        {!loading && !error && (
          <>
            {filteredTemplates.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    className="bg-gray-800/60 rounded-2xl overflow-hidden border border-gray-700 shadow-lg hover:shadow-indigo-500/20 transition duration-300 hover:border-indigo-500"
                  >
                    {/* Gambar */}
                    <div className="h-52 w-full overflow-hidden relative">
                      {tpl.image ? (
                        <img
                          src={
                            tpl.image.startsWith("http")
                              ? tpl.image
                              : `/uploads/${tpl.image.replace("/uploads/", "")}`
                          }
                          alt={tpl.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          Tidak ada gambar
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-1">{tpl.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                        {tpl.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm border border-indigo-400 text-indigo-300 rounded-full px-3 py-1">
                          {tpl.category || "Umum"}
                        </span>
                        <button
                          onClick={() => setSelectedTemplate(tpl)}
                          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
                        >
                          Lihat Detail →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 text-lg">
                Tidak ada template ditemukan untuk kategori "{selectedCategory}".
              </p>
            )}
          </>
        )}
      </section>

      {/* Modal Popup Detail */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-[90%] max-w-3xl relative shadow-2xl border border-gray-700 animate-fadeIn">
            {/* Tombol close */}
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-4 right-5 text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>

            {/* Gambar */}
            {selectedTemplate.image && (
              <div className="rounded-xl mb-5 overflow-hidden border border-gray-700">
                <img
                  src={
                    selectedTemplate.image.startsWith("http")
                      ? selectedTemplate.image
                      : `/uploads/${selectedTemplate.image.replace("/uploads/", "")}`
                  }
                  alt={selectedTemplate.name}
                  className="w-full h-72 object-cover"
                />
              </div>
            )}

            {/* Info */}
            <h2 className="text-3xl font-bold text-indigo-400 mb-2">
              {selectedTemplate.name}
            </h2>
            <p className="text-gray-300 mb-6 whitespace-pre-line leading-relaxed">
              {selectedTemplate.description}
            </p>

            {/* Tombol aksi */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Tutup
              </button>
              {selectedTemplate.demo_url && (
                <a
                  href={selectedTemplate.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Lihat Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
