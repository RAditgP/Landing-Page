'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; 
// 💡 IMPOR IKON UNTUK UI YANG LEBIH BAIK
import {
    LayoutGrid,
    Type,
    Image as ImageIcon,
    MousePointerClick,
    Plus,
    X,
    Copy,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    Download,
    Upload,
    Tablet,
    Smartphone,
    Monitor,
    Undo,
    Redo,
    Palette
} from 'lucide-react';

/* -------------------------------------------------------
    BUILDER DASHBOARD - Style #3 (Shopify / Notion-like)
-------------------------------------------------------- */

// 💡 PENAMBAHAN IKON KE DEFINISI KOMPONEN
const COMPONENTS = {
    hero: {
        name: "Hero Section",
        icon: <LayoutGrid size={18} />,
        default: {
            title: "Judul Website Kamu",
            subtitle: "Deskripsi singkat di sini",
            bgColor: "#4f46e5",
            textColor: "#ffffff",
            padding: "40px",
        },
        render: (p) => (
            <section
                className="w-full p-8 rounded-xl text-center"
                style={{ background: p.bgColor, color: p.textColor, padding: p.padding }}
            >
                <h1 className="text-4xl font-bold">{p.title}</h1>
                <p className="mt-2 text-lg">{p.subtitle}</p>
            </section>
        ),
    },

    text: {
        name: "Text Block",
        icon: <Type size={18} />,
        default: {
            text: "Tulis teks kamu di sini.",
            color: "#333333",
            size: "18px",
        },
        render: (p) => <p style={{ color: p.color, fontSize: p.size }}>{p.text}</p>,
    },

    button: {
        name: "Button",
        icon: <MousePointerClick size={18} />,
        default: {
            text: "Klik Saya",
            bg: "#2563eb",
            color: "#ffffff",
            radius: "8px",
        },
        render: (p) => (
            <button style={{ background: p.bg, color: p.color, borderRadius: p.radius }} className="px-4 py-2 font-medium transition hover:opacity-80">
                {p.text}
            </button>
        ),
    },

    image: {
        name: "Image",
        icon: <ImageIcon size={18} />,
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
                className="block max-w-full h-auto"
            />
        ),
    },
};

/* ------------------ Sidebar drag item ------------------ */
function SidebarItem({ type }) {
    const [, drag] = useDrag(() => ({ type: "component", item: { type } }));
    return (
        <button 
            ref={drag} 
            className="w-full flex items-center gap-2 text-left px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-100 transition-colors"
        >
            {COMPONENTS[type].icon}
            {COMPONENTS[type].name}
        </button>
    );
}

/* ------------------ Canvas element wrapper ------------------ */
function CanvasElement({ el, index, move, onSelect, selected, duplicate, remove, moveUp, moveDown }) {
    const ref = useRef(null);
    const [, drag] = useDrag(() => ({ type: "element", item: { index } }));
    const [{ isOver, didDrop }, drop] = useDrop({
        accept: "element",
        hover: (d, monitor) => {
            const dragIndex = d.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the item has passed half of the height
            if ((dragIndex < hoverIndex && hoverClientY < hoverMiddleY) || (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)) {
                return;
            }

            move(dragIndex, hoverIndex);
            d.index = hoverIndex;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            didDrop: monitor.didDrop(),
        }),
    });

    drag(drop(ref));

    // Styling untuk highlight saat di-hover/drop
    const dropHoverStyle = isOver && !didDrop && "border-indigo-400 border-dashed border-2 p-3 opacity-70";

    return (
        <div
            ref={ref}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(el.id);
            }}
            className={`p-4 rounded-lg border shadow-md transition-all cursor-pointer relative group 
            ${selected === el.id ? "border-indigo-500 ring-2 ring-indigo-500 bg-white" : "border-gray-200 bg-white"}
            ${dropHoverStyle}`}
        >
            {/* Bar Kontrol (Hover/Selected) */}
            <div className={`absolute top-0 right-0 p-1 z-10 transition-opacity ${selected === el.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className='flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-1 shadow-md'>
                    <span className="text-xs text-gray-600 font-medium px-1 mr-1">{COMPONENTS[el.type].name}</span>
                    
                    {/* Move Up */}
                    <button
                        onClick={(e) => { e.stopPropagation(); moveUp(el.id); }}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="Move Up"
                    >
                        <ArrowUp size={14} />
                    </button>
                    {/* Move Down */}
                    <button
                        onClick={(e) => { e.stopPropagation(); moveDown(el.id); }}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="Move Down"
                    >
                        <ArrowDown size={14} />
                    </button>
                    {/* Duplicate */}
                    <button
                        onClick={(e) => { e.stopPropagation(); duplicate(el.id); }}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title="Duplicate"
                    >
                        <Copy size={14} />
                    </button>
                    {/* Remove */}
                    <button
                        onClick={(e) => { e.stopPropagation(); remove(el.id); }}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        title="Delete"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
            
            <div className={selected === el.id ? "mt-6" : ""}>
                {COMPONENTS[el.type].render(el.props)}
            </div>
        </div>
    );
}

/* ------------------ Canvas area ------------------ */
function Canvas({ elements, setElements, setSelected, duplicate, remove, moveUp, moveDown, move, selectedId }) { 
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ["component", "element"],
        drop: (item, monitor) => {
            if (monitor.getItemType() === "component") {
                const newEl = { id: Date.now(), type: item.type, props: { ...COMPONENTS[item.type].default } };
                setElements((prev) => [...prev, newEl]);
                setSelected(newEl.id); // Pilih elemen baru setelah ditambahkan
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    const dropTargetStyle = isOver && canDrop ? "border-indigo-400 bg-indigo-50" : "border-gray-200";

    return (
        <div 
            ref={drop} 
            className={`min-h-[600px] p-6 bg-white rounded-lg border border-dashed transition-colors 
            ${dropTargetStyle}`}
        >
            {elements.length === 0 && (
                <div className="text-center text-gray-400 py-20">
                    <Plus size={32} className="mx-auto mb-2" />
                    Tarik komponen dari sidebar, atau klik 'Quick Add' di bawah.
                </div>
            )}

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

/* ------------------ Properties panel ------------------ */
function PropertiesPanel({ active, updateProp }) {
    if (!active) return <div className="p-6 text-gray-500 text-sm">Pilih elemen pada kanvas untuk mengkonfigurasi properti (warna, teks, ukuran, dll.).</div>;

    return (
        <div className="p-6 space-y-4"> {/* Menghilangkan sticky dari sini, akan di handle di parent */}
            <h3 className="font-bold text-xl border-b pb-3 flex items-center gap-2 text-gray-800">
                <Palette size={20} /> Properties — {COMPONENTS[active.type].name}
            </h3>

            {Object.keys(active.props).map((key) => {
                const val = active.props[key];
                const label = key.charAt(0).toUpperCase() + key.slice(1); // Kapitalisasi label

                // 1. Color Picker Logic
                if (key.toLowerCase().includes("color") || key === "bg" || key === "bgColor" || key === "textColor") {
                    return (
                        <div key={key}>
                            <label className="text-sm font-medium block mb-1 text-gray-700">{label}</label>
                            <div className="flex items-center gap-2">
                                <input type="text" value={val} onChange={(e) => updateProp(key, e.target.value)} className="w-full border rounded px-2 py-1 text-sm font-mono" />
                                <input type="color" value={val} onChange={(e) => updateProp(key, e.target.value)} className="w-10 h-8 p-0 border-0 cursor-pointer" />
                            </div>
                        </div>
                    );
                }

                // 2. Image URL/Upload
                if (key === "src") {
                    return (
                        <div key={key}>
                            <label className="text-sm font-medium block mb-1 text-gray-700">Image URL</label>
                            <input className="w-full border rounded px-2 py-1 text-sm" value={val} onChange={(e) => updateProp(key, e.target.value)} />
                            <div className="mt-3 border-t pt-3">
                                <label className="text-sm font-medium block mb-1">Upload File (Base64)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
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

                // 3. Range Input (radius, size, padding)
                if (String(key).toLowerCase().includes("radius") || String(key).toLowerCase().includes("size") || String(key).toLowerCase().includes("padding")) {
                    const unit = String(val).includes('%') ? '%' : 'px';
                    const numeric = parseInt(String(val).replace(/px|%/g, "")) || 0;
                    const maxVal = key.toLowerCase().includes("padding") ? 100 : key.toLowerCase().includes("size") ? 72 : 80;

                    return (
                        <div key={key}>
                            <label className="text-sm font-medium block mb-1 text-gray-700">{label} — {numeric}{unit}</label>
                            <input 
                                type="range" 
                                min={0} 
                                max={maxVal} 
                                value={numeric} 
                                onChange={(e) => updateProp(key, e.target.value + unit)} 
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm" 
                            />
                        </div>
                    );
                }

                // 4. Width / Height Range Input (Percentage)
                if ((key === "width" || key === "height") && !(key === "height" && active.type === "image")) { 
                    let numeric = parseInt(String(val).replace("%", ""));
                    if (isNaN(numeric)) numeric = 100;

                    return (
                        <div key={key}>
                            <label className="text-sm font-medium block mb-1 text-gray-700">{label} — {numeric}%</label>
                            <input 
                                type="range" 
                                min={5} 
                                max={100} 
                                value={numeric} 
                                onChange={(e) => updateProp(key, e.target.value + "%")} 
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
                            />
                        </div>
                    );
                }
                
                // 5. Default Text Input
                return (
                    <div key={key}>
                        <label className="text-sm font-medium block mb-1 text-gray-700">{label}</label>
                        <input className="w-full border rounded px-2 py-1 text-sm" value={val} onChange={(e) => updateProp(key, e.target.value)} />
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
        } else {
            pushHistory(elements); // Init empty history if no saved data
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const undo = () => {
        const h = history.current;
        if (h.index <= 0) return;
        h.index -= 1;
        const prev = JSON.parse(h.stack[h.index]);
        setElements(prev);
        setSelectedId(null);
    };

    const redo = () => {
        const h = history.current;
        if (h.index >= h.stack.length - 1) return;
        h.index += 1;
        const next = JSON.parse(h.stack[h.index]);
        setElements(next);
        setSelectedId(null);
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
        const copy = { ...el, id: Date.now(), props: { ...el.props } }; // Deep copy props
        const idx = elements.findIndex((e) => e.id === id);
        const next = [...elements.slice(0, idx + 1), copy, ...elements.slice(idx + 1)];
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
        setElements(copy); // Move tidak di-commit ke history (terlalu banyak)
    };

    const moveUp = (id) => {
        const idx = elements.findIndex((e) => e.id === id);
        if (idx <= 0) return;
        const copy = [...elements];
        [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]]; // Swap
        commit(copy);
    };

    const moveDown = (id) => {
        const idx = elements.findIndex((e) => e.id === id);
        if (idx === -1 || idx >= elements.length - 1) return;
        const copy = [...elements];
        [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]]; // Swap
        commit(copy);
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
                const [mimePart, dataPart] = src.split(';base64,');
                if (!dataPart) continue;
                
                const mimeType = mimePart.split(':')[1];
                const extension = mimeType.split('/')[1]?.split('+')[0] || 'png';
                const fileName = `image_${imageCounter}.${extension}`;

                assetsFolder.file(fileName, dataPart, { base64: true });
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
                {/* LEFT DARK SIDEBAR (Components) */}
                <aside className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800 shadow-xl z-20">
                    <div className="p-4 text-xl font-extrabold tracking-tight border-b border-gray-800">
                        DevBuilder 🛠️
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto space-y-4">
                        <div className="text-xs uppercase font-bold text-indigo-400 mb-2 border-b border-gray-700 pb-1">Components</div>
                        <div className="space-y-2">
                            {Object.keys(COMPONENTS).map((k) => (
                                <SidebarItem key={k} type={k} />
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-700">
                            <h4 className="text-sm text-gray-400 font-semibold mb-2">Quick Add</h4>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {Object.keys(COMPONENTS).map((k) => (
                                    <button 
                                        key={k} 
                                        onClick={() => addElement(k)} 
                                        className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1"
                                    >
                                        <Plus size={14} /> {COMPONENTS[k].name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
                        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Documentation & Help</a>
                    </div>
                </aside>

                {/* MAIN WORKSPACE */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* HEADER (Controls) */}
                    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shadow-sm z-10">
                        <div className="text-base font-semibold text-gray-700">Page: My Landing Page</div>

                        <div className="ml-auto flex items-center gap-4">
                            {/* Preview Mode */}
                            <div className="flex border rounded-lg overflow-hidden">
                                <button title="Desktop" onClick={() => setPreviewMode("desktop")} className={`px-2 py-1 text-sm ${previewMode === "desktop" ? "bg-indigo-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>
                                    <Monitor size={18} />
                                </button>
                                <button title="Tablet" onClick={() => setPreviewMode("tablet")} className={`px-2 py-1 text-sm border-l ${previewMode === "tablet" ? "bg-indigo-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>
                                    <Tablet size={18} />
                                </button>
                                <button title="Mobile" onClick={() => setPreviewMode("mobile")} className={`px-2 py-1 text-sm border-l ${previewMode === "mobile" ? "bg-indigo-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}>
                                    <Smartphone size={18} />
                                </button>
                            </div>

                            {/* History Controls */}
                            <div className="flex items-center gap-2">
                                <button onClick={undo} className="p-2 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100 disabled:opacity-50" disabled={history.current.index <= 0} title="Undo">
                                    <Undo size={18} />
                                </button>
                                <button onClick={redo} className="p-2 border rounded-lg text-sm bg-gray-50 hover:bg-gray-100 disabled:opacity-50" disabled={history.current.index >= history.current.stack.length - 1} title="Redo">
                                    <Redo size={18} />
                                </button>
                            </div>
                            
                            {/* Actions */}
                            <button onClick={exportZIP} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold flex items-center gap-1 hover:bg-indigo-700 transition">
                                <Download size={18} /> Export
                            </button>

                            <label className="px-3 py-2 border border-gray-300 rounded-lg cursor-pointer text-sm font-semibold bg-gray-50 flex items-center gap-1 hover:bg-gray-100 transition">
                                <Upload size={18} /> Import
                                <input type="file" accept="application/json" onChange={(e) => importJSON(e.target.files?.[0])} className="hidden" />
                            </label>
                            
                        </div>
                    </header>

                    {/* WORKSPACE + PROPS */}
                    <div className="flex flex-1 p-6 gap-6 overflow-hidden">
                        
                        {/* Canvas column (center) */}
                        <div className="flex-1 overflow-auto flex items-start justify-center pt-8 pb-16">
                            <div
                                className={`bg-white rounded-xl shadow-2xl border transition-all duration-300 overflow-hidden ${
                                    previewMode === "mobile" ? "max-w-[375px]" : 
                                    previewMode === "tablet" ? "max-w-[800px]" : 
                                    "max-w-5xl"
                                }`}
                                // PERBAIKAN 1: Clear selection saat klik di luar elemen
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
                        <aside className="w-80 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto shadow-lg">
                            {/* 💡 CONTAINER STICKY UNTUK PROPS */}
                            <div className="sticky top-0 h-full">
                                <PropertiesPanel active={active} updateProp={updateProp} />
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </DndProvider>
    );
}