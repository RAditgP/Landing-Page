"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const navLinks = [
    {
      title: "Link Cepat",
      links: [
        { name: "Beranda", href: "/" },
        { name: "Fitur", href: "/fitur" },
        { name: "Template", href: "/template" },
      ],
    },
    {
      title: "Perusahaan",
      links: [
        { name: "Harga", href: "/harga" },
        { name: "Kontak", href: "/kontak" },
       
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Kebijakan Privasi", href: "#" },
        { name: "Syarat & Ketentuan", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- Bagian Atas: Logo, Deskripsi & Navigasi --- */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-10 mb-8">
          
          {/* Kolom 1: Logo & Deskripsi (Lebar 2 kolom) */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-2xl font-extrabold mb-3 text-blue-400">DevLaunch</h3>
            <p className="text-sm mb-4 text-gray-400 max-w-sm">
              DevLaunch adalah solusi terdepan untuk membangun website profesional dengan Next.js dan Tailwind CSS, cepat dan tanpa pusing.
            </p>
            
            {/* Link Sosial Media (dengan ikon) */}
            <div className="flex gap-4 mt-6">
              {/* Instagram */}
              <a href="https://www.instagram.com/gp_raditya/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition">
                {/* Ikon Instagram */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.955.923 1.417.444.462.873.735 1.417.923.51.198 1.09.333 1.942.372.854.038 1.127.047 3.297.047 2.172 0 2.444-.01 3.298-.047.854-.04 1.434-.175 1.943-.372a3.917 3.917 0 0 0 1.417-.923c.445-.462.718-.891.923-1.417.197-.509.332-1.09.37-1.942.04-.853.047-1.125.047-3.297s-.007-2.444-.048-3.297c-.04-.853-.174-1.433-.372-1.942a3.917 3.917 0 0 0-.923-1.417A3.927 3.927 0 0 0 13.24 0.42c-.51-.198-1.09-.333-1.942-.372C10.444.01 10.172 0 8 0zm0 2.166c2.163 0 2.417.01 3.26.05 1.347.07 2.308.275 3.181 1.148.875.873 1.072 1.835 1.148 3.181.041.844.05 1.097.05 3.26s-.009 2.417-.05 3.26c-.076 1.347-.281 2.308-1.149 3.181-.875.875-1.837 1.072-3.183 1.148-.845.041-1.097.05-3.26.05s-2.417-.009-3.26-.05c-1.346-.076-2.308-.281-3.182-1.149C1.83 13.238 1.633 12.275 1.557 10.93c-.04-.843-.047-1.096-.047-3.26s.007-2.417.047-3.26c.076-1.347.281-2.308 1.149-3.182.872-.873 1.834-1.071 3.181-1.149.843-.04 1.096-.047 3.26-.047z"/>
                    <path d="M8 5.486a2.514 2.514 0 1 0 0 5.028 2.514 2.514 0 0 0 0-5.028zM8 9.53a1.53 1.53 0 1 1 0-3.06 1.53 1.53 0 0 1 0 3.06z"/>
                    <path d="M11.843 3.61a.952.952 0 1 0 0 1.904.952.952 0 0 0 0-1.904z"/>
                </svg>
              </a>
              
              {/* GitHub */}
              <a href="https://github.com/RAditgP" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition">
                {/* Ikon GitHub */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.21 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
              
              {/* Placeholder: LinkedIn */}
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                {/* Ikon LinkedIn */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.55 1.358-1.243-.004-.7-.52-1.243-1.348-1.243-.824 0-1.35.54-1.35 1.243 0 .693.521 1.243 1.327 1.243h.01zM13.792 13.394V9.894c0-1.27-.267-2.25-1.849-2.25-.97 0-1.39.65-1.625 1.121-.097.165-.122.373-.122.584V13.394H7.808V6.169h2.152v1.076h.052c.3-.466.864-1.22 1.96-1.22 1.258 0 2.28 1.037 2.28 3.327v4.04z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Kolom Navigasi Link Cepat, Perusahaan, Legal */}
          {navLinks.map((section, index) => (
            <div key={index} className="col-span-1">
              <h4 className="text-sm font-bold text-white uppercase mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* --- Bagian CTA dan Hak Cipta --- */}
        <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* CTA Tambahan di Footer */}
            <div className="mb-4 md:mb-0 text-center md:text-left">
                <p className="text-sm text-gray-400 mb-2">
                    Siap memulai proyek Anda?
                </p>
                <a 
                    href="/daftar" 
                    className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                    Daftar Gratis
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>

            {/* Hak Cipta */}
            <div className="text-center text-sm">
                <p className="text-gray-500">
                    © {currentYear} DevLaunch. Semua hak dilindungi.
                </p>
                <p className="text-gray-500 text-xs mt-1">
                    Dibuat dengan ✨ oleh RAditgP
                </p>
            </div>
        </div>
      </div>
    </footer>
  );
}