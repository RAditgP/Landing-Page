"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Edit3, Trash2, Save, X, Search } from "lucide-react";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    tag: "",
    demoUrl: "",
    useUrl: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Daftar kategori tetap
  const categories = [
    "Landing Page",
    "Portfolio",
    "Bisnis",
    "Toko Online",
    "Blog",
    "Company Profile",
  ];

  // ============================================================
  // 🔄 Ambil data dari API
  // ============================================================
  async function fetchTemplates() {
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error("Gagal mengambil data template");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.data || [];
      setTemplates(arr);
      setFilteredTemplates(arr);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data template");
    }
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  // ============================================================
  // 🧠 Handle Input
  // ============================================================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ============================================================
  // 💾 Tambah / Update Template
  // ============================================================
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const method = editing ? "PUT" : "POST";
    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    try {
      const res = await fetch("/api/templates", { method, body: formData });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Gagal menyimpan template");
      alert(editing ? "✅ Template berhasil diperbarui!" : "✅ Template berhasil ditambahkan!");
      setForm({
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
      setEditing(false);
      fetchTemplates();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // ✏️ Edit Template
  // ============================================================
  const handleEdit = (tpl) => {
    setEditing(true);
    setForm(tpl);
    setPreview(tpl.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================================
  // ❌ Batal Edit
  // ============================================================
  const cancelEdit = () => {
    setEditing(false);
    setForm({
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
  };

  // ============================================================
  // 🗑️ Hapus Template
  // ============================================================
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus template ini?")) return;
    try {
      const res = await fetch("/api/templates", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      alert(result.message || "Template dihapus!");
      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  // ============================================================
  // 🔍 Search & Filter
  // ============================================================
  useEffect(() => {
    let data = templates;

    if (search) {
      data = data.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory) {
      data = data.filter(
        (t) => t.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    setFilteredTemplates(data);
  }, [search, filterCategory, templates]);

  // ============================================================
  // 🧩 UI
  // ============================================================
  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Kelola Template
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 border p-6 rounded-xl shadow-md mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editing ? "✏️ Edit Template" : "➕ Tambah Template"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Nama Template</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="Masukkan nama template"
              required
            />
          </div>

          <div>
            <label className="font-medium">Kategori</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
              required
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="font-medium">Deskripsi</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
            placeholder="Tulis deskripsi template"
            rows={3}
          ></textarea>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="font-medium">Tag</label>
            <input
              name="tag"
              value={form.tag}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="contoh: landing, bisnis, portfolio"
            />
          </div>
          <div>
            <label className="font-medium">Gambar Preview</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
            />
            {preview && (
              <Image
                src={preview}
                alt="Preview"
                width={200}
                height={120}
                className="mt-2 rounded-md border"
              />
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="font-medium">Demo URL</label>
            <input
              type="url"
              name="demoUrl"
              value={form.demoUrl}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="https://contoh-demo.com"
            />
          </div>
          <div>
            <label className="font-medium">Gunakan URL</label>
            <input
              type="url"
              name="useUrl"
              value={form.useUrl}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="https://contoh.com/gunakan"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Save size={18} />
            {loading ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah Template"}
          </button>

          {editing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 flex items-center gap-2"
            >
              <X size={18} /> Batal
            </button>
          )}
        </div>
      </form>

      {/* FILTER + SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center border rounded-md px-2 w-full md:w-1/2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 w-full focus:outline-none"
          />
        </div>
        <select
          className="border p-2 rounded-md"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Gambar</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Kategori</th>
              <th className="p-3 border">Tag</th>
              <th className="p-3 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTemplates.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            ) : (
              filteredTemplates.map((tpl, i) => (
                <tr key={tpl.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border text-center">{i + 1}</td>
                  <td className="p-3 border text-center">
                    {tpl.image ? (
                      <Image
                        src={tpl.image}
                        alt={tpl.name}
                        width={70}
                        height={50}
                        className="rounded-md mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 border">{tpl.name}</td>
                  <td className="p-3 border">{tpl.category}</td>
                  <td className="p-3 border">{tpl.tag}</td>
                  <td className="p-3 border text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(tpl)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tpl.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
