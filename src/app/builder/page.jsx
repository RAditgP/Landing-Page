"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const COMPONENTS = {
  hero: { name: "Hero Section", default: { title: "Judul Website Kamu", subtitle: "Deskripsi singkat di sini", bgColor: "#4f46e5", textColor: "#ffffff", padding: "40px" },
    render: (p) => (
      <section className="w-full rounded-xl" style={{ background: p.bgColor, color: p.textColor, padding: p.padding }}>
        <h1 className="text-4xl font-bold">{p.title}</h1>
        <p className="mt-2 text-lg">{p.subtitle}</p>
      </section>
    ),
  },
  text: { name: "Text Block", default: { text: "Tulis teks kamu di sini.", color: "#333333", size: "18px" },
    render: (p) => <p style={{ color: p.color, fontSize: p.size }}>{p.text}</p>,
  },
  button: { name: "Button", default: { text: "Klik Saya", bg: "#2563eb", color: "#ffffff", radius: "8px" },
    render: (p) => <button style={{ background: p.bg, color: p.color, borderRadius: p.radius }} className="px-4 py-2 font-medium">{p.text}</button>,
  },
  image: { name: "Image", default: { src: "https://via.placeholder.com/600x300", radius: "12px", width: "100%", height: "auto", objectFit: "cover" },
    render: (p) => <img src={p.src} alt="image" style={{ borderRadius: p.radius, width: p.width, height: p.height, objectFit: p.objectFit }} className="w-full" />,
  },
};

// ==================== KOMPONEN KECIL ====================

function SidebarItem({ type }) {
  const [, drag] = useDrag(() => ({ type: "component", item: { type } }));
  const icons = { hero: "Home", text: "Text", button: "Button", image: "Image" };
  return (
    <button ref={drag} className="w-full text-left px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-100 transition flex items-center gap-3">
      <span>{icons[type]}</span>
      {COMPONENTS[type].name}
    </button>
  );
}

function CanvasElement({ el, index, move, onSelect, selected, duplicate, remove, moveUp, moveDown }) {
  const ref = useRef(null);
  const [, drag] = useDrag(() => ({ type: "element", item: { index } }));
  const [, drop] = useDrop({
    accept: "element",
    hover: (d) => { if (d.index !== index) move(d.index, index); d.index = index; },
  });
  drag(drop(ref));

  const ControlBar = () => (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-white rounded-lg shadow-xl border border-gray-300 flex gap-1 px-3 py-2">
        {[{ icon: "Copy", title: "Duplicate", action: duplicate },
          { icon: "Up", title: "Naik", action: moveUp },
          { icon: "Down", title: "Turun", action: moveDown },
          { icon: "Delete", title: "Hapus", action: remove, cls: "text-red-600" },
        ].map((b) => (
          <button key={b.title} onClick={(e) => { e.stopPropagation(); b.action(el.id); }}
            className={`p-2 hover:bg-gray-100 rounded transition ${b.cls || ""}`} title={b.title}>
            {b.icon}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      onClick={(e) => { e.stopPropagation(); onSelect(el.id); }}
      className={`relative p-8 rounded-2xl border-2 transition-all cursor-move group bg-white
        ${selected === el.id ? "border-indigo-500 shadow-2xl ring-4 ring-indigo-100" : "border-transparent hover:border-gray-300 hover:shadow-xl"}`}
    >
      {selected === el.id && <ControlBar />}
      {COMPONENTS[el.type].render(el.props)}
    </div>
  );
}

function Canvas({ elements, setElements, setSelected, duplicate, remove, moveUp, moveDown, move, selectedId }) {
  const [, drop] = useDrop({
    accept: "component",
    drop: (item) => {
      const newEl = { id: Date.now(), type: item.type, props: { ...COMPONENTS[item.type].default } };
      setElements(prev => [...prev, newEl]);
      setSelected(newEl.id);
    },
  });

  return (
    <div ref={drop} className="min-h-screen p-8 bg-gray-50">
      {elements.length === 0 && (
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-6 opacity-20">Drag & Drop</div>
            <p className="text-xl text-gray-500 font-medium">Tarik komponen dari sidebar untuk memulai</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        {elements.map((el, i) => (
          <CanvasElement
            key={el.id}
            el={el}
            index={i}
            move={move}
            onSelect={setSelected}
            selected={selectedId}
            duplicate={duplicate}
            remove={remove}
            moveUp={moveUp}
            moveDown={moveDown}
          />
        ))}
      </div>
    </div>
  );
}

function PropertiesPanel({ active, updateProp }) {
  if (!active) return (
    <div className="h-full flex items-center justify-center p-12">
      <div className="text-center bg-gray-50 rounded-3xl p-16">
        <p className="text-2xl text-gray-400 font-medium">Pilih elemen untuk mengubah properti</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      <h3 className="text-2xl font-bold text-indigo-700 border-b-2 border-indigo-200 pb-4">
        Properties — {COMPONENTS[active.type].name}
      </h3>
      <div className="space-y-6">
        {Object.keys(active.props).map((key) => {
          const val = active.props[key];
          if (key.toLowerCase().includes("color") || key === "bg") {
            return (
              <div key={key}>
                <label className="block text-sm font-medium capitalize mb-2">{key.replace(/([A-Z])/g, ' $1')}</label>
                <input type="color" value={val} onChange={(e) => updateProp(key, e.target.value)} className="w-full h-12 rounded cursor-pointer" />
              </div>
            );
          }
          if (key === "src") {
            return (
              <div key={key} className="space-y-3">
                <label className="block text-sm font-medium">Image URL</label>
                <input className="w-full border rounded-lg px-4 py-2" value={val} onChange={(e) => updateProp(key, e.target.value)} />
                <div>
                  <label className="block text-sm font-medium mt-4">Atau Upload Gambar</label>
                  <input type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const r = new FileReader();
                        r.onload = (ev) => updateProp(key, ev.target.result);
                        r.readAsDataURL(f);
                      }
                    }}
                  />
                </div>
              </div>
            );
          }
          if (['radius', 'padding', 'size'].some(k => key.toLowerCase().includes(k))) {
            const numeric = parseInt(val) || 0;
            const unit = val.includes('%') ? '%' : 'px';
            const max = key.toLowerCase().includes('size') ? 72 : 100;
            return (
              <div key={key}>
                <label className="block text-sm font-medium capitalize">{key} — {numeric}{unit}</label>
                <input type="range" min="0" max={max} value={numeric}
                  onChange={(e) => updateProp(key, e.target.value + unit)}
                  className="w-full h-2 mt-2 rounded-lg appearance-none cursor-pointer bg-gray-300" />
              </div>
            );
          }
          return (
            <div key={key}>
              <label className="block text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input className="w-full border rounded-lg px-4 py-2 mt-1" value={val} onChange={(e) => updateProp(key, e.target.value)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== KOMPONEN UTAMA ====================

export default function Builder() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [webName, setWebName] = useState("Landing Page Baru");
  const [savedDrafts, setSavedDrafts] = useState([]);
  const history = useRef({ stack: [], index: -1 });

  // Muat semua draft saat pertama kali buka
  useEffect(() => {
    const drafts = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("builder_draft_")) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.webName) drafts.push({ key, name: data.webName });
        } catch { }
      }
    }
    setSavedDrafts(drafts);
  }, []);

  // Auto-save
  useEffect(() => {
    if (!webName.trim() || elements.length === 0) return;
    const key = `builder_draft_${webName.replace(/\s+/g, '-').toLowerCase()}`;
    localStorage.setItem(key, JSON.stringify({ webName, elements }));
    setSavedDrafts(prev => prev.some(d => d.key === key) ? prev : [...prev, { key, name: webName }]);
  }, [webName, elements]);

  const loadDraft = (key, name) => {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      setWebName(parsed.webName);
      setElements(parsed.elements || []);
      setSelectedId(null);
      alert(`Draft "${name}" berhasil dimuat!`);
    }
  };

  const deleteDraft = (key, name) => {
    if (confirm(`Hapus draft "${name}"?`)) {
      localStorage.removeItem(key);
      setSavedDrafts(prev => prev.filter(d => d.key !== key));
    }
  };

  const pushHistory = (next) => {
    const h = history.current;
    h.stack = h.stack.slice(0, h.index + 1);
    h.stack.push(JSON.stringify(next));
    h.index++;
  };
  const commit = (next) => { setElements(next); pushHistory(next); };

  const undo = () => { if (history.current.index > 0) { history.current.index--; setElements(JSON.parse(history.current.stack[history.current.index])); } };
  const redo = () => { if (history.current.index < history.current.stack.length - 1) { history.current.index++; setElements(JSON.parse(history.current.stack[history.current.index])); } };

  const duplicate = (id) => {
    const el = elements.find(e => e.id === id);
    if (el) commit([...elements.slice(0, elements.findIndex(e => e.id === id) + 1), { ...el, id: Date.now() }, ...elements.slice(elements.findIndex(e => e.id === id) + 1)]);
  };
  const remove = (id) => commit(elements.filter(e => e.id !== id));
  const move = (from, to) => { const copy = [...elements]; const [m] = copy.splice(from, 1); copy.splice(to, 0, m); commit(copy); };
  const moveUp = (id) => { const i = elements.findIndex(e => e.id === id); if (i > 0) move(i, i - 1); };
  const moveDown = (id) => { const i = elements.findIndex(e => e.id === id); if (i < elements.length - 1) move(i, i + 1); };
  const updateProp = (key, val) => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, props: { ...el.props, [key]: val } } : el));

  const exportZIP = async () => {
    if (!webName.trim()) return alert("Isi nama website dulu!");
    const zip = new JSZip();
    const assets = zip.folder("assets");
    let imgCount = 1;
    const exportEls = JSON.parse(JSON.stringify(elements));
    for (const el of exportEls) {
      if (el.type === "image" && el.props.src.startsWith("data:")) {
        const [_, data] = el.props.src.split(";base64,");
        const ext = el.props.src.split("/")[1].split(";")[0];
        const name = `image_${imgCount++}.${ext}`;
        assets.file(name, data, { base64: true });
        el.props.src = `./assets/${name}`;
      }
    }
    const generateHTML = (els, name) => {
      const rendered = els.map(el => {
        const style = Object.entries(el.props).filter(([k]) => ['background', 'color', 'fontSize', 'padding', 'borderRadius'].includes(k))
          .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');
        switch (el.type) {
          case 'hero': return `<section style="${style}" class="w-full max-w-6xl mx-auto rounded-xl p-10"><h1 class="text-5xl font-bold">${el.props.title}</h1><p class="mt-4 text-xl">${el.props.subtitle}</p></section>`;
          case 'text': return `<div class="max-w-6xl mx-auto my-8"><p style="${style}">${el.props.text}</p></div>`;
          case 'button': return `<div class="max-w-6xl mx-auto my-8 text-center"><button style="${style}" class="px-6 py-3 rounded-lg font-medium">${el.props.text}</button></div>`;
          case 'image': return `<div class="max-w-6xl mx-auto my-8"><img src="${el.props.src}" alt="" style="${style}" class="w-full rounded-xl"/></div>`;
          default: return '';
        }
      }).join('\n\n');
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${name}</title><script src="https://cdn.tailwindcss.com"></script><style>body{margin:0;padding:40px 0;background:#f9fafb}</style></head><body><div class="min-h-screen">${rendered}</div></body></html>`;
    };
    zip.file("index.html", generateHTML(exportEls, webName));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${webName.replace(/\s/g, "_")}_website.zip`);
    alert(`Website "${webName}" berhasil dipublish!`);
  };

  const active = elements.find(e => e.id === selectedId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-300 flex items-center px-8 shadow-sm">
          <div className="flex items-center gap-6 flex-1">
            <a href="/" className="text-3xl hover:text-indigo-600 transition">Home</a>
            <h1 className="text-2xl font-bold text-gray-800">Landing Page Builder</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Route/Nama Web:</span>
              <input type="text" value={webName} onChange={(e) => setWebName(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Landing Page Baru" />
            </div>
            <select value={previewMode} onChange={(e) => setPreviewMode(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option>Desktop</option>
              <option>Tablet</option>
              <option>Mobile</option>
            </select>
            <button onClick={undo} className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled={history.current.index <= 0}>Undo</button>
            <button onClick={redo} className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled={history.current.index >= history.current.stack.length - 1}>Redo</button>
            <button onClick={() => alert(webName ? `Draft "${webName}" tersimpan otomatis!` : "Isi nama dulu")} className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-md">Save Draft</button>
            <button onClick={exportZIP} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md">Publish (ZIP)</button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR KIRI */}
          <aside className="w-80 bg-gray-900 text-white p-6 space-y-8 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Builder Panel</h2>
              <button onClick={() => confirm("Buat project baru?") && (setElements([]), setWebName("Landing Page Baru"))} className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-sm font-medium">New</button>
            </div>

            {/* MUAT DRAFT */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider">Draft Awal</h3>
              <button className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition">
                Muat Draft Lain
              </button>

              {savedDrafts.length > 0 && (
                <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                  <p className="text-xs text-gray-400">Daftar Draft Tersimpan:</p>
                  {savedDrafts.map(d => (
                    <div key={d.key} className="flex items-center justify-between bg-gray-800 rounded px-3 py-2 text-sm">
                      <span className="truncate flex-1">{d.name}</span>
                      <div className="flex gap-2">
                        <button onClick={() => loadDraft(d.key, d.name)} className="text-green-400 hover:text-green-300">Muat</button>
                        <button onClick={() => deleteDraft(d.key, d.name.name)} className="text-red-400 hover:text-red-300">Hapus</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase">Components (Drag & Drop)</h3>
              {Object.keys(COMPONENTS).map(k => <SidebarItem key={k} type={k} />)}
            </div>

            <div className="pt-6 border-t border-gray-800">
              <h4 className="text-sm font-bold text-gray-400 mb-3">Quick Add (Click)</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(COMPONENTS).map(k => (
                  <button key={k} onClick={() => {
                    const newEl = { id: Date.now(), type: k, props: { ...COMPONENTS[k].default } };
                    commit([...elements, newEl]);
                    setSelectedId(newEl.id);
                  }} className="px-4 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-sm">
                    Add {COMPONENTS[k].name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CANVAS TENGAH */}
          <main className="flex-1 bg-gray-100 overflow-auto" onClick={() => setSelectedId(null)}>
            <div className={`mx-auto my-8 transition-all ${previewMode === "mobile" ? "max-w-sm" : previewMode === "tablet" ? "max-w-4xl" : "max-w-7xl"}`}>
              <div className="bg-white rounded-3xl shadow-2xl border-4 border-gray-200 overflow-hidden">
                <Canvas elements={elements} setElements={setElements} setSelected={setSelectedId} selectedId={selectedId}
                  duplicate={duplicate} remove={remove} moveUp={moveUp} moveDown={moveDown} move={move} />
              </div>
            </div>
          </main>

          {/* PANEL PROPERTIES KANAN */}
          <aside className="w-96 bg-white border-l border-gray-200 overflow-y-auto shadow-xl">
            <PropertiesPanel active={active} updateProp={updateProp} />
          </aside>
        </div>
      </div>
    </DndProvider>
  );
}