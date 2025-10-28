"use client";
import { useState, useEffect } from "react";

export default function AdminTemplates() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Personal",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const categories = ["Personal", "Bisnis", "Portfolio", "Aplikasi", "Lainnya"];

  // 🔹 Fetch data template
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error("Gagal memuat template");
      const data = await res.json();
      setTemplates(data);
    } catch (err) {
      setMessage("❌ Tidak dapat memuat template dari server");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      setMessage("⚠️ Semua field wajib diisi!");
      return;
    }

    try {
      setMessage("⏳ Mengupload...");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      if (form.image) formData.append("image", form.image);

      const res = await fetch("/api/templates", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal");

      setMessage("✅ Template berhasil ditambahkan!");
      setForm({ name: "", description: "", category: "Personal", image: null });
      setPreview(null);
      fetchTemplates();
    } catch (err) {
      setMessage(`❌ Terjadi kesalahan: ${err.message}`);
    }
  };

  return (
    <div className="text-white pb-20">
      <h1 className="text-3xl font-extrabold mb-8">Kelola Template ⚙️</h1>

      {/* 🔹 Form Tambah Template */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] border border-gray-700 p-6 rounded-2xl shadow-lg mb-10"
        encType="multipart/form-data"
      >
        <div className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Template"
            value={form.name}
            onChange={handleChange}
            className="bg-[#0f172a] border border-gray-700 p-3 rounded-lg focus:border-indigo-500 outline-none"
          />
          <textarea
            name="description"
            placeholder="Deskripsi Template"
            value={form.description}
            onChange={handleChange}
            className="bg-[#0f172a] border border-gray-700 p-3 rounded-lg h-24 resize-none focus:border-indigo-500 outline-none"
          />

          {/* 🔹 Dropdown kategori */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="bg-[#0f172a] border border-gray-700 p-3 rounded-lg focus:border-indigo-500 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* 🔹 Upload Gambar */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="bg-[#0f172a] border border-gray-700 p-3 rounded-lg"
          />

          {preview && (
            <div className="mt-2">
              <p className="text-gray-400 text-sm mb-1">Preview Gambar:</p>
              <img
                src={preview}
                alt="Preview"
                className="rounded-xl w-full h-48 object-cover border border-gray-700"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold transition"
          >
            Simpan Template
          </button>
        </div>
        {message && <p className="mt-3 text-gray-300">{message}</p>}
      </form>

      {/* 🔹 Daftar Template */}
      <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Daftar Template</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.length > 0 ? (
          templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#1e293b] border border-gray-700 rounded-xl shadow-lg hover:border-indigo-500 transition overflow-hidden"
            >
              {tpl.image && (
                <img
                  src={tpl.image}
                  alt={tpl.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <span className="text-xs bg-indigo-600 px-2 py-1 rounded-full">
                  {tpl.category}
                </span>
                <h3 className="text-lg font-semibold mt-2 text-indigo-300">
                  {tpl.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {tpl.description}
                </p>
                <button
                  onClick={() => setSelectedTemplate(tpl)}
                  className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 py-1 rounded-lg text-sm font-medium"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            Belum ada template yang ditambahkan.
          </p>
        )}
      </div>

      {/* 🔹 Modal Detail */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow-2xl max-w-xl w-[90%] relative">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>

            {selectedTemplate.image && (
              <img
                src={selectedTemplate.image}
                alt={selectedTemplate.name}
                className="rounded-lg mb-4 w-full h-60 object-cover border border-gray-700"
              />
            )}

            <span className="text-sm bg-indigo-600 px-3 py-1 rounded-full">
              {selectedTemplate.category}
            </span>
            <h2 className="text-2xl font-bold text-indigo-400 mt-3">
              {selectedTemplate.name}
            </h2>
            <p className="text-gray-300 mt-2 whitespace-pre-line">
              {selectedTemplate.description}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"
              >
                Tutup
              </button>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
              >
                Lihat Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
