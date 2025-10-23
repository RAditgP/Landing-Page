"use client";
import { useState, useEffect } from "react";

export default function AdminTemplates() {
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const res = await fetch("/api/templates");
    const data = await res.json();
    setTemplates(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Menambahkan template...");

    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Template berhasil ditambahkan!");
      setForm({ name: "", description: "", image: "" });
      fetchTemplates();
    } else {
      setMessage(`❌ Gagal: ${data.error}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8 text-white">
        Kelola Template ⚙️
      </h1>

      {/* Form Tambah Template */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e293b] p-6 rounded-2xl shadow-lg mb-10 border border-gray-700"
      >
        <div className="grid gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Template"
            value={form.name}
            onChange={handleChange}
            className="bg-[#0f172a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="description"
            placeholder="Deskripsi"
            value={form.description}
            onChange={handleChange}
            className="bg-[#0f172a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="image"
            placeholder="URL Gambar (opsional)"
            value={form.image}
            onChange={handleChange}
            className="bg-[#0f172a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold transition"
          >
            Simpan Template
          </button>
        </div>
        {message && <p className="mt-3 text-gray-300">{message}</p>}
      </form>

      {/* List Template */}
      <div className="grid md:grid-cols-3 gap-6">
        {templates.length > 0 ? (
          templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#1e293b] border border-gray-700 rounded-xl shadow p-4 hover:border-indigo-500 transition"
            >
              {tpl.image && (
                <img
                  src={tpl.image}
                  alt={tpl.name}
                  className="rounded-lg mb-3 w-full h-40 object-cover"
                />
              )}
              <h2 className="text-lg font-bold text-indigo-400">{tpl.name}</h2>
              <p className="text-gray-300 text-sm mt-1">{tpl.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Belum ada template yang ditambahkan.</p>
        )}
      </div>
    </div>
  );
}
