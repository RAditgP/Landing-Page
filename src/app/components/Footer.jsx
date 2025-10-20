export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-center py-8">
      <h3 className="text-lg font-semibold mb-2">DevLaunch</h3>
      <p className="text-sm mb-4">Bangun website profesional dengan mudah dan cepat 🚀</p>
      <div className="flex justify-center gap-6 text-gray-400 mb-4">
        <a href="#" className="hover:text-white">Instagram</a>
        <a href="#" className="hover:text-white">GitHub</a>
        <a href="#" className="hover:text-white">LinkedIn</a>
      </div>
      <p className="text-xs text-gray-500">
        © {new Date().getFullYear()} DevLaunch. Semua hak dilindungi.
      </p>
    </footer>
  );
}
