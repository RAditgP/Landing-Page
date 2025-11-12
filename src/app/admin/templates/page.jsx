"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, Save, X, Loader2 } from "lucide-react";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    tag: "",
    demoUrl: "",
    useUrl: "",
    image: null,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  // ==========================================================
  // 🔄 Ambil Data Template
  // ==========================================================
  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      const templatesArray = Array.isArray(data) ? data : data.data || [];
      setTemplates(templatesArray);
    } catch (err) {
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // 🧭 Handle Input
  // ==========================================================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ==========================================================
  // 💾 Simpan / Update Template
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const method = editing ? "PUT" : "POST";
    const body = new FormData();
    for (const key in formData) {
      if (formData[key]) body.append(key, formData[key]);
    }

    const res = await fetch("/api/templates", { method, body });
    const result = await res.json();
    alert(result.message || result.error);

    if (res.ok) {
      resetForm();
      fetchTemplates();
    }
  };

  // ==========================================================
  // ✏️ Edit Template
  // ==========================================================
  const handleEdit = (tpl) => {
    setEditing(tpl.id);
    setFormData({
      id: tpl.id,
      name: tpl.name,
      category: tpl.category,
      description: tpl.description,
      tag: tpl.tag,
      demoUrl: tpl.demoUrl,
      useUrl: tpl.useUrl,
      image: null,
    });
    setPreview(tpl.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==========================================================
  // 🗑️ Hapus Template
  // ==========================================================
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus template ini?")) return;
    const res = await fetch("/api/templates", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    alert(result.message || result.error);
    fetchTemplates();
  };

  // ==========================================================
  // ♻️ Reset Form
  // ==========================================================
  const resetForm = () => {
    setEditing(null);
    setFormData({
      id: "",
      name: "",
      category: "",
      description: "",
      tag: "",
      demoUrl: "",
      useUrl: "",
      image: null,
    });
    setPreview(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-10 text-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* ========================================== */}
        {/* 🧾 FORM INPUT TEMPLATE */}
        {/* ========================================== */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg border mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
            {editing ? "✏️ Edit Template" : "➕ Tambah Template Baru"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "name", label: "Nama Template", placeholder: "Masukkan nama template" },
              { name: "category", label: "Kategori", placeholder: "Contoh: Landing Page, Portfolio" },
              { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Tulis deskripsi singkat..." },
              { name: "tag", label: "Tag", placeholder: "Misal: bisnis, portfolio" },
            ].map((input, idx) => (
              <div key={idx}>
                <label className="block font-semibold mb-1">{input.label}</label>
                {input.type === "textarea" ? (
                  <textarea
                    name={input.name}
                    placeholder={input.placeholder}
                    value={formData[input.name]}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border p-3 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    name={input.name}
                    placeholder={input.placeholder}
                    value={formData[input.name]}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                )}
              </div>
            ))}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold mb-1">Demo URL</label>
                <input
                  type="url"
                  name="demoUrl"
                  placeholder="https://contoh-demo.com"
                  value={formData.demoUrl}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Gunakan URL</label>
                <input
                  type="url"
                  name="useUrl"
                  placeholder="https://contoh.com/gunakan"
                  value={formData.useUrl}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-md bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Upload Gambar</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full border p-3 rounded-md bg-gray-100"
              />
              {preview && (
                <Image
                  src={preview}
                  alt="Preview"
                  width={250}
                  height={150}
                  className="mt-3 rounded-lg border shadow-sm"
                />
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {editing ? "Simpan Perubahan" : "Tambah Template"}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-5 py-2.5 rounded-lg shadow"
                >
                  <X size={18} /> Batal
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* ========================================== */}
        {/* 📋 TABEL TEMPLATE */}
        {/* ========================================== */}
        <motion.div
          className="bg-white rounded-2xl shadow-md border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold text-center py-4 text-gray-800">
            📋 Daftar Template
          </h2>

          {loading ? (
            <p className="text-center py-8 text-gray-500">Memuat data...</p>
          ) : templates.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>Belum ada template yang ditambahkan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-t">
                <thead className="bg-gray-100 sticky top-0">
                  <tr className="text-sm text-gray-700">
                    <th className="py-2 border">No</th>
                    <th className="py-2 border">Gambar</th>
                    <th className="py-2 border">Nama</th>
                    <th className="py-2 border">Kategori</th>
                    <th className="py-2 border">Deskripsi</th>
                    <th className="py-2 border">Tag</th>
                    <th className="py-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((tpl, i) => (
                    <motion.tr
                      key={tpl.id}
                      className="text-center border-t hover:bg-gray-50 transition"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">
                        {tpl.image ? (
                          <Image
                            src={tpl.image}
                            alt={tpl.name}
                            width={70}
                            height={50}
                            className="rounded-lg mx-auto"
                          />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-2 font-medium">{tpl.name}</td>
                      <td className="p-2">{tpl.category}</td>
                      <td className="p-2 text-sm text-gray-600">
                        {tpl.description}
                      </td>
                      <td className="p-2">{tpl.tag}</td>
                      <td className="p-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(tpl)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1.5 rounded-md flex items-center gap-1"
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tpl.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Hapus
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
