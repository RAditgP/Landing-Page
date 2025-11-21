"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; 

/* -------------------------------------------------------
   1. KOMPONEN DEFINISI (Tidak Berubah)
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

/* -------------------------------------------------------
   2. SUB-KOMPONEN UI (Tidak Berubah)
-------------------------------------------------------- */

function SidebarItem({ type }) {
  const [, drag] = useDrag(() => ({ type: "component", item: { type } }));
  return (
    <button 
      ref={drag} 
      className="w-full text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-100 transition-colors"
    >
      {COMPONENTS[type].name}
    </button>
  );
}

function CanvasElement({ el, index, move, onSelect, selected, duplicate, remove, moveUp, moveDown }) {
  const ref = useRef(null);
  
  // Drag functionality
  const [, drag] = useDrag(() => ({ type: "element", item: { index } }));
  
  // Drop functionality
  const [, drop] = useDrop({
    accept: "element",
    hover: (d) => {
      if (d.index !== index) move(d.index, index);
      d.index = index;
    },
  });

  drag(drop(ref));

  // Control bar rendering
  const ControlBar = () => (
    <div className="flex justify-between items-start mb-3 p-2 bg-gray-100 border border-gray-200 rounded-t-lg -m-4 mb-2">
      <span className="text-sm text-gray-600 font-medium">{COMPONENTS[el.type].name}</span>
      <div className="flex gap-1 text-xs">
        {[
          { icon: '⎘', title: 'Duplicate', action: duplicate },
          { icon: '↑', title: 'Move Up', action: moveUp },
          { icon: '↓', title: 'Move Down', action: moveDown },
          { icon: '✕', title: 'Delete', action: remove, className: "bg-red-100 text-red-600" },
        ].map((item) => (
          <button
            key={item.title}
            onClick={(e) => {
              e.stopPropagation();
              item.action(el.id);
            }}
            className={`px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors ${item.className || ''}`}
            title={item.title}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(el.id);
      }}
      className={`p-4 rounded-lg border shadow-md transition-all cursor-pointer ${
        selected === el.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white hover:shadow-lg"
      }`}
    >
      {selected === el.id && <ControlBar />}
            
      {COMPONENTS[el.type].render(el.props)}
    </div>
  );
}

function Canvas({ elements, setElements, setSelected, duplicate, remove, moveUp, moveDown, move, selectedId }) { 
  // Drop target for new components
  const [, drop] = useDrop(() => ({
    accept: "component",
    drop: (item) => {
      const newEl = { id: Date.now(), type: item.type, props: { ...COMPONENTS[item.type].default } };
      setElements((prev) => [...prev, newEl]);
      setSelected(newEl.id);
    },
  }));

  return (
    <div ref={drop} className="min-h-[600px] p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200 w-full">
      {elements.length === 0 && <div className="text-center text-gray-400 p-12">Tarik komponen dari sidebar untuk memulai</div>}

      <div className="flex flex-col gap-4">
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
  if (!active) return <div className="p-6 text-gray-500">Pilih elemen untuk mengubah properti</div>;

  return (
    <div className="p-6 space-y-4 sticky top-4">
      <h3 className="font-bold text-xl border-b pb-2 text-indigo-700">Properties — {COMPONENTS[active.type].name}</h3>

      {Object.keys(active.props).map((key) => {
        const val = active.props[key];

        // Color Picker Logic
        if (key.toLowerCase().includes("color") || key === "bg") {
          return (
            <div key={key}>
              <label className="text-sm font-medium block capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
              <input type="color" value={val} onChange={(e) => updateProp(key, e.target.value)} className="w-full h-10 mt-2 border-none rounded" />
            </div>
          );
        }

        // Image Source & Upload
        if (key === "src") {
          return (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium block">Image URL</label>
              <input 
                className="w-full border rounded px-3 py-1.5" 
                value={val} 
                onChange={(e) => updateProp(key, e.target.value)} 
                placeholder="http://..."
              />
              <div>
                <label className="text-sm font-medium block mt-2">Atau Upload Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mt-2"
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

        // Radius/Padding/Size Range Logic
        if (['radius', 'padding', 'size'].some(k => key.toLowerCase().includes(k)) || key.toLowerCase().includes('font')) {
          const max = key.toLowerCase().includes('size') || key.toLowerCase().includes('font') ? 72 : 80;
          const min = key.toLowerCase().includes('size') || key.toLowerCase().includes('font') ? 10 : 0;
          const unit = String(val).endsWith('%') ? '%' : 'px';
          
          const numeric = parseInt(String(val).replace(/px|%/, "")) || 0;
          
          return (
            <div key={key}>
              <label className="text-sm font-medium block capitalize">{key.replace(/([A-Z])/g, ' $1').trim()} — {numeric}{unit}</label>
              <input 
                type="range" 
                min={min} 
                max={max} 
                value={numeric} 
                onChange={(e) => updateProp(key, e.target.value + unit)} 
                className="w-full mt-2" 
              />
            </div>
          );
        }

        // Width / Height Range Input Logic (Percentage)
        if ((key === "width" || key === "height") && active.type !== "image") { 
          let numeric = parseInt(String(val).replace("%", ""));
          if (isNaN(numeric)) numeric = 100;
          return (
            <div key={key}>
              <label className="text-sm font-medium block capitalize">{key} — {numeric}%</label>
              <input 
                type="range" 
                min={5} 
                max={100} 
                value={numeric} 
                onChange={(e) => updateProp(key, e.target.value + "%")} 
                className="w-full mt-2" 
              />
            </div>
          );
        }

        // Default Text/Select Input
        return (
          <div key={key}>
            <label className="text-sm font-medium block capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
            <input 
              className="w-full border rounded px-3 py-1.5 mt-1" 
              value={val} 
              onChange={(e) => updateProp(key, e.target.value)} 
            />
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------
   3. KOMPONEN UTAMA BUILDER (Diperbarui)
-------------------------------------------------------- */

// Fungsi untuk menghasilkan markup HTML dari elemen (BARU)
const generateHTML = (elements, webName) => {
  // Map untuk konversi props style menjadi string CSS
  const styleToString = (props) => Object.entries(props)
    .filter(([key]) => ['width', 'height', 'objectFit', 'borderRadius', 'background', 'color', 'fontSize', 'padding'].includes(key)) // Hanya ambil style yang relevan
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`)
    .join(';');

  // Render elemen ke string HTML
  const renderedElements = elements.map(el => {
    const style = styleToString(el.props);
    const props = el.props;
    
    // Tambahkan kelas Tailwind untuk tata letak dasar (margin/padding/max-width)
    const containerClass = el.type === 'image' || el.type === 'button' || el.type === 'text' ? 'px-10' : '';

    switch (el.type) {
      case 'hero':
        return `<section style="${style}" class="w-full rounded-xl p-10 mx-auto max-w-6xl">
          <h1 style="font-size: 2.25rem; font-weight: 700;">${props.title}</h1>
          <p style="margin-top: 0.5rem; font-size: 1.125rem;">${props.subtitle}</p>
        </section>`;
      case 'text':
        return `<div class="mx-auto max-w-6xl ${containerClass}"><p style="${style}">${props.text}</p></div>`;
      case 'button':
        // Tambahkan kelas dasar untuk tombol
        return `<div class="mx-auto max-w-6xl ${containerClass}"><button style="${style}" class="px-4 py-2 font-medium transition-colors">${props.text}</button></div>`;
      case 'image':
        // Tambahkan kelas untuk responsivitas gambar
        return `<div class="mx-auto max-w-6xl ${containerClass}"><img src="${props.src}" alt="image" style="${style}" class="w-full h-auto object-cover"/></div>`;
      default:
        return '';
    }
  }).join('\n\n');


  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${webName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; background-color: #f7f7f7; font-family: ui-sans-serif, system-ui; }
    .site-container { 
      max-width: 100%; 
      margin: 0 auto; 
      display: flex; 
      flex-direction: column; 
      gap: 24px; /* Jarak antar komponen */
      padding: 40px 0;
    }
  </style>
</head>
<body>
  <div class="site-container">
    ${renderedElements}
  </div>
  <footer>
    <p style="text-align: center; margin-top: 40px; color: #999; font-size: 14px;">Published via Builder UI</p>
  </footer>
</body>
</html>
`;
};


export default function Builder() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  // STATE BARU: Untuk nama website (Simulasi route /web/[webname])
  const [webName, setWebName] = useState("Landing Page Baru"); 

  // History for undo/redo (using useCallback for stability)
  const history = useRef({ stack: [], index: -1 });

  const pushHistory = useCallback((next) => {
    const h = history.current;
    h.stack = h.stack.slice(0, h.index + 1);
    h.stack.push(JSON.stringify(next));
    h.index = h.stack.length - 1;
  }, []);

  const commit = useCallback((next) => {
    setElements(next);
    pushHistory(next);
  }, [pushHistory]);

  // ---------------- LOGIC DRAFT (BARU) ----------------

  // Fungsi untuk menyimpan draft ke LocalStorage
  const saveDraft = useCallback(() => {
    if (!webName.trim()) {
      alert("Nama Website tidak boleh kosong untuk menyimpan draft.");
      return;
    }
    const sanitizedWebName = webName.trim().replace(/\s/g, '-').toLowerCase();
    const draftData = { webName, elements };
    localStorage.setItem(`builder_draft_${sanitizedWebName}`, JSON.stringify(draftData));
    localStorage.setItem("builder_last_draft_name", webName); 
    alert(`✅ Draft "${webName}" berhasil disimpan!`);
  }, [webName, elements]);

  // Fungsi untuk memuat draft dari LocalStorage
  const loadDraft = useCallback((name) => {
    const sanitizedName = name.trim().replace(/\s/g, '-').toLowerCase();
    const saved = localStorage.getItem(`builder_draft_${sanitizedName}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWebName(parsed.webName);
        setElements(parsed.elements);
        pushHistory(parsed.elements);
        setSelectedId(null);
        alert(`💾 Draft "${parsed.webName}" berhasil dimuat.`);
      } catch (e) {
        alert("Gagal memuat draft. Data rusak.");
      }
    } else {
      alert(`Draft dengan nama "${name}" tidak ditemukan.`);
    }
  }, [pushHistory]);

  // Initial load (Load draft terakhir yang diedit)
  useEffect(() => {
    const lastDraftName = localStorage.getItem("builder_last_draft_name") || "Landing Page Baru";
    setWebName(lastDraftName);

    const saved = localStorage.getItem(`builder_draft_${lastDraftName.replace(/\s/g, '-').toLowerCase()}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setElements(parsed.elements);
        pushHistory(parsed.elements);
      } catch (e) {
        setElements([]);
        pushHistory([]);
      }
    } else {
      pushHistory(elements);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Auto-save ke LocalStorage saat elements atau webName berubah
  useEffect(() => {
    localStorage.setItem("builder_last_draft_name", webName); 
    
    if (webName.trim()) {
      const sanitizedWebName = webName.trim().replace(/\s/g, '-').toLowerCase();
      const draftData = { webName, elements };
      localStorage.setItem(`builder_draft_${sanitizedWebName}`, JSON.stringify(draftData));
    }
  }, [elements, webName]);


  // Core actions (undo, redo, addElement, duplicate, remove, move, moveUp, moveDown, updateProp)
  // ... (Semua fungsi ini tetap sama seperti kode Anda, hanya bergantung pada 'commit' dan 'pushHistory')

  const undo = useCallback(() => {
    const h = history.current;
    if (h.index <= 0) return;
    h.index -= 1;
    const prev = JSON.parse(h.stack[h.index]);
    setElements(prev);
  }, []);

  const redo = useCallback(() => {
    const h = history.current;
    if (h.index >= h.stack.length - 1) return;
    h.index += 1;
    const next = JSON.parse(h.stack[h.index]);
    setElements(next);
  }, []);

  const addElement = useCallback((type) => {
    const newEl = { id: Date.now(), type, props: { ...COMPONENTS[type].default } };
    const next = [...elements, newEl];
    commit(next);
    setSelectedId(newEl.id);
  }, [elements, commit]);


  const duplicate = useCallback((id) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    const copy = { ...el, id: Date.now() };
    const idx = elements.findIndex((e) => e.id === id);
    
    // Insert the copy immediately after the original
    const next = [...elements.slice(0, idx + 1), copy, ...elements.slice(idx + 1)];
    commit(next);
    setSelectedId(copy.id); 
  }, [elements, commit]);

  const remove = useCallback((id) => {
    const next = elements.filter((e) => e.id !== id);
    commit(next);
    if (selectedId === id) setSelectedId(null);
  }, [elements, commit, selectedId]);

  const move = useCallback((from, to) => {
    const copy = [...elements];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    setElements(copy); 
    pushHistory(copy);
  }, [elements, pushHistory]);


  const moveUp = useCallback((id) => {
    const idx = elements.findIndex((e) => e.id === id);
    if (idx <= 0) return;
    move(idx, idx - 1);
  }, [elements, move]);

  const moveDown = useCallback((id) => {
    const idx = elements.findIndex((e) => e.id === id);
    if (idx === -1 || idx >= elements.length - 1) return;
    move(idx, idx + 1);
  }, [elements, move]);

  const updateProp = useCallback((key, value) => {
    setElements((prev) => {
      const next = prev.map((el) => (el.id === selectedId ? { ...el, props: { ...el.props, [key]: value } } : el));
      pushHistory(next);
      return next;
    });
  }, [selectedId, pushHistory]);


  const active = elements.find((e) => e.id === selectedId) || null;


  /* ------------------ Export/Import Logic (Diperbarui) ------------------ */

  const exportZIP = async () => {
    if (!webName.trim()) {
      alert("Nama Website tidak boleh kosong. Harap isi nama website sebelum mempublish.");
      return;
    }
    const exportElements = JSON.parse(JSON.stringify(elements)); 
    const zip = new JSZip();
    
    let imageCounter = 1;
    const assetsFolder = zip.folder("assets");

    // 1. Ekstrak Gambar Base64 dan Perbarui Path
    for (const el of exportElements) {
      if (el.type === 'image' && el.props.src && el.props.src.startsWith('data:image')) {
        
        const src = el.props.src;
        const [mimePart, dataPart] = src.split(';base64,');
        if (!dataPart) continue;
        
        const mimeType = mimePart.split(':')[1];
        const extension = mimeType.split('/')[1]?.split('+')[0] || 'png';
        
        const fileName = `image_${imageCounter}.${extension}`;

        assetsFolder.file(fileName, dataPart, { base64: true });

        // Path di HTML akan menjadi relatif ke folder assets/
        el.props.src = `./assets/${fileName}`; 
        imageCounter++;
      }
    }

    // 2. Tambahkan File JSON (Draft Mentah)
    const dataJSON = JSON.stringify(exportElements, null, 2);
    zip.file("template_draft.json", dataJSON);

    // 3. BARU: Generate dan Tambahkan index.html (Publishable Output)
    const htmlContent = generateHTML(exportElements, webName);
    zip.file("index.html", htmlContent);

    // 4. Generate dan Download ZIP
    try {
      const sanitizedFileName = webName.replace(/\s/g, '_').toLowerCase();
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${sanitizedFileName}_publish.zip`);
      alert(`🎉 Website "${webName}" berhasil diekspor sebagai ZIP (index.html)!`);
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
        // Jika ini adalah file draft, kita bisa mengidentifikasi namanya jika ada
        const isDraftFile = parsed.webName && parsed.elements;
        const elementsToLoad = isDraftFile ? parsed.elements : parsed;
        const nameToLoad = isDraftFile ? parsed.webName : "Imported Website";

        setElements(elementsToLoad);
        setWebName(nameToLoad);
        pushHistory(elementsToLoad);
        setSelectedId(null); 
      } catch (err) {
        alert("File tidak valid. Pastikan itu adalah file JSON/draft yang benar.");
      }
    };
    r.readAsText(file);
  };

  /* ------------------ Rendering UI (Diperbarui) ------------------ */
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex bg-gray-50">
        {/* 1. LEFT DARK SIDEBAR (Builder Panel) */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
          <div className="p-4 text-lg font-bold tracking-wide border-b border-gray-800 flex items-center justify-between">
            <span>Builder Panel</span>
            <button
              onClick={() => {
                const newName = prompt("Masukkan Nama Website Baru:");
                if (newName) {
                  setWebName(newName);
                  setElements([]);
                  setSelectedId(null);
                  history.current = { stack: [], index: -1 };
                  pushHistory([]);
                }
              }}
              title="Buat Template Baru"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded transition-colors font-semibold"
            >
              New
            </button>
          </div>

          <div className="p-4 space-y-4 border-b border-gray-800">
            <div className="text-xs uppercase text-gray-400 font-bold">Draft Awal</div>
            <button
              onClick={() => {
                const draftName = prompt("Masukkan Nama Draft yang ingin dimuat:");
                if (draftName) loadDraft(draftName);
              }}
              className="w-full px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 transition-colors font-semibold"
            >
              📂 Muat Draft Lain
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div className="text-xs uppercase text-gray-400 font-bold">Components (Drag & Drop)</div>
            {Object.keys(COMPONENTS).map((k) => (
              <SidebarItem key={k} type={k} />
            ))}

            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-sm text-gray-400 font-bold mb-2">Quick Add (Click)</h4>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(COMPONENTS).map((k) => (
                  <button 
                    key={k} 
                    onClick={() => addElement(k)} 
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors"
                  >
                    Add {COMPONENTS[k].name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
            © Builder UI
          </div>
        </aside>

        {/* 2. MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col">
          {/* HEADER (Diperbarui) */}
          <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
            {/* TOMBOL KEMBALI KE BERANDA */}
            <a 
              href="/" 
              className="text-2xl text-gray-600 hover:text-indigo-600 transition-colors" 
              title="Kembali ke Beranda"
            >
              🏠
            </a>
            <div className="text-xl font-bold text-gray-800">Landing Page Builder</div>

            {/* Input Nama Website (Simulasi Route /web/[webname]) */}
            <div className="flex items-center gap-2 border-l pl-4">
              <label className="text-sm font-medium text-gray-500 hidden md:block">Route/Nama Web:</label>
              <input
                type="text"
                value={webName}
                onChange={(e) => setWebName(e.target.value)}
                className="border rounded-lg px-3 py-1 text-sm font-semibold w-60"
                placeholder="Nama Website"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <select value={previewMode} onChange={(e) => setPreviewMode(e.target.value)} className="border rounded-lg px-3 py-1 text-sm appearance-none cursor-pointer">
                <option value="desktop">Desktop</option>
                <option value="tablet">Tablet</option>
                <option value="mobile">Mobile</option>
              </select>

              <button onClick={undo} className="px-3 py-1 border rounded-lg text-sm bg-gray-100 hover:bg-gray-200 transition-colors" disabled={history.current.index <= 0}>Undo</button>
              <button onClick={redo} className="px-3 py-1 border rounded-lg text-sm bg-gray-100 hover:bg-gray-200 transition-colors" disabled={history.current.index >= history.current.stack.length - 1}>Redo</button>

              {/* Tombol Save Draft BARU */}
              <button onClick={saveDraft} className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                💾 Save Draft
              </button>
              
              {/* Tombol Export ZIP (Publish) */}
              <button onClick={exportZIP} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                🚀 Publish (ZIP)
              </button>

              <label className="px-3 py-1 border rounded-lg cursor-pointer text-sm bg-gray-100 hover:bg-gray-200 transition-colors">
                Import JSON
                <input type="file" accept="application/json" onChange={(e) => importJSON(e.target.files?.[0])} className="hidden" />
              </label>
            </div>
          </header>

          {/* WORKSPACE + PROPS */}
          <div className="flex flex-1 gap-6 p-6 overflow-hidden">
            {/* Canvas column (center) */}
            <div className="flex-1 overflow-y-auto flex items-start justify-center">
              <div
                className={`bg-white rounded-xl shadow-2xl border border-gray-300 p-6 transition-all ${
                  previewMode === "mobile" ? "max-w-[375px]" : previewMode === "tablet" ? "max-w-[768px]" : "max-w-6xl"
                }`}
                onClick={() => setSelectedId(null)} 
              >
                <Canvas
                  elements={elements}
                  setElements={setElements}
                  setSelected={setSelectedId}
                  selectedId={selectedId} 
                  duplicate={duplicate}
                  remove={remove}
                  moveUp={moveUp}
                  moveDown={moveDown}
                  move={move}
                />
              </div>
            </div>

            {/* Right properties panel (sticky) */}
            <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto shadow-inner rounded-l-xl">
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