"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; 

/* -------------------------------------------------------
   BUILDER DASHBOARD - Style #3 (Shopify / Notion-like)
-------------------------------------------------------- */

const COMPONENTS = {
  hero: {
    name: "Hero Section",
    default: {
      title: "Judul Website Kamu",
      subtitle: "Deskripsi singkat di sini",
      bgColor: "#4f46e5",
      textColor: "#ffffff",
      padding: "40px",
    },
    render: (p) => (
      <section
        className="w-full rounded-xl"
        style={{ background: p.bgColor, color: p.textColor, padding: p.padding }}
      >
        <h1 className="text-4xl font-bold">{p.title}</h1>
        <p className="mt-2 text-lg">{p.subtitle}</p>
      </section>
    ),
  },

  text: {
    name: "Text Block",
    default: {
      text: "Tulis teks kamu di sini.",
      color: "#333333",
      size: "18px",
    },
    render: (p) => <p style={{ color: p.color, fontSize: p.size }}>{p.text}</p>,
  },

  button: {
    name: "Button",
    default: {
      text: "Klik Saya",
      bg: "#2563eb",
      color: "#ffffff",
      radius: "8px",
    },
    render: (p) => (
      <button style={{ background: p.bg, color: p.color, borderRadius: p.radius }} className="px-4 py-2 font-medium">
        {p.text}
      </button>
    ),
  },

  image: {
    name: "Image",
    default: {
      src: "https://via.placeholder.com/600x300",
      radius: "12px",
      width: "100%",
      height: "auto",
      objectFit: "cover",
    },
    render: (p) => (
      <img
        src={p.src}
        alt="image"
        style={{ borderRadius: p.radius, width: p.width, height: p.height, objectFit: p.objectFit }}
      />
    ),
  },
};

/* ------------------ Sidebar drag item ------------------ */
function SidebarItem({ type }) {
  const [, drag] = useDrag(() => ({ type: "component", item: { type } }));
  return (
    <button ref={drag} className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-100">
      {COMPONENTS[type].name}
    </button>
  );
}

/* ------------------ Canvas element wrapper ------------------ */
function CanvasElement({ el, index, move, onSelect, selected, duplicate, remove, moveUp, moveDown }) {
  const ref = useRef(null);
  const [, drag] = useDrag(() => ({ type: "element", item: { index } }));
  const [, drop] = useDrop({
    accept: "element",
    hover: (d) => {
      if (d.index !== index) move(d.index, index);
      d.index = index;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(el.id);
      }}
      className={`p-4 rounded-lg border shadow-sm transition-all cursor-pointer ${
        selected === el.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"
      }`}
    >
      {/* Bar Kontrol hanya muncul jika elemen ini sedang terpilih (el.id === selected) */}
      {selected === el.id && (
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm text-gray-600">{COMPONENTS[el.type].name}</span>
          <div className="flex gap-1 text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicate(el.id);
              }}
              className="px-2 py-1 bg-gray-100 rounded"
              title="Duplicate"
            >
              ⎘
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveUp(el.id);
              }}
              className="px-2 py-1 bg-gray-100 rounded"
              title="Move Up"
            >
              ↑
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveDown(el.id);
              }}
              className="px-2 py-1 bg-gray-100 rounded"
              title="Move Down"
            >
              ↓
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                remove(el.id);
              }}
              className="px-2 py-1 bg-red-100 text-red-600 rounded"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>
      )}
            
      {COMPONENTS[el.type].render(el.props)}
    </div>
  );
}

/* ------------------ Canvas area ------------------ */
// PERUBAHAN 2: Menerima prop selectedId
function Canvas({ elements, setElements, setSelected, duplicate, remove, moveUp, moveDown, move, selectedId }) { 
  // accept components dropped from sidebar
  const [, drop] = useDrop(() => ({
    accept: "component",
    drop: (item) => {
      const newEl = { id: Date.now(), type: item.type, props: { ...COMPONENTS[item.type].default } };
      setElements((prev) => [...prev, newEl]);
      setSelected(newEl.id); // Pilih elemen baru setelah ditambahkan
    },
  }));

  return (
    <div ref={drop} className="min-h-[600px] p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
      {elements.length === 0 && <div className="text-center text-gray-400">Tarik komponen dari sidebar untuk memulai</div>}

      <div className="flex flex-col gap-4">
        {elements.map((el, i) => (
          <CanvasElement
            key={el.id}
            el={el}
            index={i}
            move={move}
            onSelect={setSelected}
            selected={selectedId} // PERUBAHAN 3: Teruskan selectedId ke CanvasElement
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

/* ------------------ Properties panel ------------------ */
function PropertiesPanel({ active, updateProp }) {
  if (!active) return <div className="p-6 text-gray-500">Pilih elemen untuk mengubah properti</div>;

  return (
    <div className="p-6 space-y-4 sticky top-4">
      <h3 className="font-semibold text-lg border-b pb-2">Properties — {COMPONENTS[active.type].name}</h3>

      {Object.keys(active.props).map((key) => {
        const val = active.props[key];

        // 1. Color Picker Logic: Mencakup 'color', 'bgcolor', 'textcolor', dan 'bg'
        if (key.toLowerCase().includes("color") || key === "bg") {
          return (
            <div key={key}>
              <label className="text-sm font-medium">{key}</label>
              <input type="color" value={val} onChange={(e) => updateProp(key, e.target.value)} className="w-full h-10 mt-2" />
            </div>
          );
        }

        // image src (url + upload)
        if (key === "src") {
          return (
            <div key={key}>
              <label className="text-sm font-medium">Image URL</label>
              <input className="w-full border rounded px-2 py-1 mt-2" value={val} onChange={(e) => updateProp(key, e.target.value)} />
              <div className="mt-2">
                <label className="text-sm font-medium block">Or upload</label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = (ev) => updateProp(key, ev.target.result);
                    r.readAsDataURL(f);
                  }}
                />
              </div>
            </div>
          );
        }

        // radius
        if (String(key).toLowerCase().includes("radius")) {
          const px = parseInt(String(val).replace("px", "")) || 0;
          return (
            <div key={key}>
              <label className="text-sm font-medium">{key} — {px}px</label>
              <input type="range" min={0} max={80} value={px} onChange={(e) => updateProp(key, e.target.value + "px")} className="w-full mt-2" />
            </div>
          );
        }

        // 2. Width / Height Range Input Logic (Percentage)
        // Pengecualian: 'height' pada komponen 'image' dialihkan ke input teks biasa agar bisa menerima "auto"
        if ((key === "width" || key === "height") && !(key === "height" && active.type === "image")) { 
          let numeric = parseInt(String(val).replace("%", ""));
          if (isNaN(numeric)) numeric = 100;
          return (
            <div key={key}>
              <label className="text-sm font-medium">{key} — {numeric}%</label>
              <input type="range" min={5} max={100} value={numeric} onChange={(e) => updateProp(key, e.target.value + "%")} className="w-full mt-2" />
            </div>
          );
        }

        // font size style
        if (String(key).toLowerCase().includes("size") || String(key).toLowerCase().includes("font")) {
          const px = parseInt(String(val).replace("px", "")) || 16;
          return (
            <div key={key}>
              <label className="text-sm font-medium">{key} — {px}px</label>
              <input type="range" min={10} max={72} value={px} onChange={(e) => updateProp(key, e.target.value + "px")} className="w-full mt-2" />
            </div>
          );
        }

        // default text input (Termasuk height: 'auto' dari Image)
        return (
          <div key={key}>
            <label className="text-sm font-medium">{key}</label>
            <input className="w-full border rounded px-2 py-1 mt-2" value={val} onChange={(e) => updateProp(key, e.target.value)} />
          </div>
        );
      })}
    </div>
  );
}

/* ------------------ Main Builder component ------------------ */
export default function Builder() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop"); // desktop | tablet | mobile

  // history for undo/redo
  const history = useRef({ stack: [], index: -1 });

  const pushHistory = (next) => {
    const h = history.current;
    h.stack = h.stack.slice(0, h.index + 1);
    h.stack.push(JSON.stringify(next));
    h.index = h.stack.length - 1;
  };

  const commit = (next) => {
    setElements(next);
    pushHistory(next);
  };

  // init history
  useEffect(() => {
    pushHistory(elements);
    // load saved draft if available
    const saved = localStorage.getItem("builder_template");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setElements(parsed);
        pushHistory(parsed);
      } catch (e) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const undo = () => {
    const h = history.current;
    if (h.index <= 0) return;
    h.index -= 1;
    const prev = JSON.parse(h.stack[h.index]);
    setElements(prev);
  };

  const redo = () => {
    const h = history.current;
    if (h.index >= h.stack.length - 1) return;
    h.index += 1;
    const next = JSON.parse(h.stack[h.index]);
    setElements(next);
  };

  const addElement = (type) => {
    const newEl = { id: Date.now(), type, props: { ...COMPONENTS[type].default } };
    const next = [...elements, newEl];
    commit(next);
    setSelectedId(newEl.id); // Pilih elemen baru setelah ditambahkan
  };

  const duplicate = (id) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    const copy = { ...el, id: Date.now() };
    const next = [...elements, copy];
    commit(next);
    setSelectedId(copy.id); // Pilih elemen duplikat baru
  };

  const remove = (id) => {
    const next = elements.filter((e) => e.id !== id);
    commit(next);
    if (selectedId === id) setSelectedId(null);
  };

  const move = (from, to) => {
    const copy = [...elements];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    commit(copy);
  };

  const moveUp = (id) => {
    const idx = elements.findIndex((e) => e.id === id);
    if (idx <= 0) return;
    move(idx, idx - 1);
  };

  const moveDown = (id) => {
    const idx = elements.findIndex((e) => e.id === id);
    if (idx === -1 || idx >= elements.length - 1) return;
    move(idx, idx + 1);
  };

  const updateProp = (key, value) => {
    setElements((prev) => {
      const next = prev.map((el) => (el.id === selectedId ? { ...el, props: { ...el.props, [key]: value } } : el));
      pushHistory(next);
      return next;
    });
  };

  const active = elements.find((e) => e.id === selectedId) || null;

  // export / import
  const exportZIP = async () => {
    const exportElements = JSON.parse(JSON.stringify(elements)); 
    const zip = new JSZip();
    
    let imageCounter = 1;
    const assetsFolder = zip.folder("assets");

    // 1. Ekstrak Gambar Base64 dan Perbarui Path di exportElements
    for (const el of exportElements) {
      if (el.type === 'image' && el.props.src && el.props.src.startsWith('data:image')) {
        
        const src = el.props.src;
        
        // Pisahkan Tipe Mime dan Data Base64
        const [mimePart, dataPart] = src.split(';base64,');
        if (!dataPart) continue;
        
        const mimeType = mimePart.split(':')[1];
        // OPTIMASI: Menangani image/svg+xml atau mime type kompleks lainnya
        const extension = mimeType.split('/')[1]?.split('+')[0] || 'png';
        
        const fileName = `image_${imageCounter}.${extension}`;

        // 1a. Tambahkan data Base64 ke folder assets di ZIP
        assetsFolder.file(fileName, dataPart, { base64: true });

        // 1b. Ganti properti src di JSON dengan path relatif
        el.props.src = `./assets/${fileName}`; 
        imageCounter++;
      }
    }

    // 2. Tambahkan File JSON yang sudah diperbarui ke dalam ZIP
    const dataJSON = JSON.stringify(exportElements, null, 2);
    zip.file("template.json", dataJSON);

    // 3. Generate dan Download ZIP
    try {
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "website_template.zip");
      alert("Template berhasil diekspor ke website_template.zip!");
    } catch (err) {
      alert("Gagal membuat file ZIP.");
      console.error(err);
    }
  };

  const importJSON = (file) => {
    const r = new FileReader();
    r.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        setElements(parsed);
        pushHistory(parsed);
        setSelectedId(null); // Clear selection after import
      } catch (err) {
        alert("File tidak valid");
      }
    };
    r.readAsText(file);
  };
  // --- End of export/import ---

  // save to localstorage automatically
  useEffect(() => {
    localStorage.setItem("builder_template", JSON.stringify(elements));
  }, [elements]);

  // rendering layout (dashboard)
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex bg-gray-100">
        {/* LEFT DARK SIDEBAR */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
          <div className="p-4 text-lg font-semibold tracking-wide border-b border-gray-800 flex items-center justify-between">
            <span>Builder Panel</span>
            <button
              onClick={() => {
                // quick new template
                setElements([]);
                setSelectedId(null);
                history.current = { stack: [], index: -1 };
              }}
              title="New"
              className="text-xs bg-gray-700 px-2 py-1 rounded"
            >
              New
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            <div className="text-xs uppercase text-gray-400 mb-2">Components</div>
            {Object.keys(COMPONENTS).map((k) => (
              <SidebarItem key={k} type={k} />
            ))}

            <div className="pt-4">
              <h4 className="text-sm text-gray-400">Quick Add</h4>
              <div className="flex gap-2 mt-2 flex-wrap">
                {Object.keys(COMPONENTS).map((k) => (
                  <button key={k} onClick={() => addElement(k)} className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">
                    Add {COMPONENTS[k].name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
            © Builder UI
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col">
          {/* HEADER */}
          <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
            <div className="text-lg font-semibold">Landing Page Builder</div>

            <div className="ml-auto flex items-center gap-2">
              <select value={previewMode} onChange={(e) => setPreviewMode(e.target.value)} className="border rounded px-2 py-1 text-sm">
                <option value="desktop">Desktop</option>
                <option value="tablet">Tablet</option>
                <option value="mobile">Mobile</option>
              </select>

              <button onClick={undo} className="px-3 py-1 border rounded text-sm bg-gray-50">Undo</button>
              <button onClick={redo} className="px-3 py-1 border rounded text-sm bg-gray-50">Redo</button>

              {/* Tombol Export ZIP */}
              <button onClick={exportZIP} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Export (ZIP)</button>

              <label className="px-3 py-1 border rounded cursor-pointer text-sm bg-gray-50">
                Import
                <input type="file" accept="application/json" onChange={(e) => importJSON(e.target.files?.[0])} className="hidden" />
              </label>
            </div>
          </header>

          {/* WORKSPACE + PROPS */}
          <div className="flex flex-1 gap-6 p-6 overflow-hidden">
            {/* Canvas column (center) */}
            <div className="flex-1 overflow-auto flex items-start justify-center">
              <div
                className={`bg-white rounded-lg shadow-sm border p-6 w-full ${previewMode === "mobile" ? "max-w-[360px]" : previewMode === "tablet" ? "max-w-[768px]" : "max-w-4xl"}`}
                // PERBAIKAN 1: Clear selection saat klik di luar elemen
                onClick={() => setSelectedId(null)} 
              >
                <Canvas
                  elements={elements}
                  setElements={setElements}
                  setSelected={setSelectedId}
                  selectedId={selectedId} // PERUBAHAN 1: Meneruskan selectedId
                  duplicate={duplicate}
                  remove={remove}
                  moveUp={moveUp}
                  moveDown={moveDown}
                  move={move}
                />
              </div>
            </div>

            {/* Right properties panel (sticky) */}
            <aside className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
              <div className="p-4">
                <PropertiesPanel active={active} updateProp={updateProp} />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </DndProvider>
  );
}