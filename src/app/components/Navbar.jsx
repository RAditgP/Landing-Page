export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <h1 className="text-2xl font-bold text-blue-600">MyBrand</h1>
      <ul className="hidden md:flex space-x-6">
        <li><a href="#home" className="hover:text-blue-600">Home</a></li>
        <li><a href="#features" className="hover:text-blue-600">Features</a></li>
        <li><a href="#about" className="hover:text-blue-600">About</a></li>
        <li><a href="#contact" className="hover:text-blue-600">Contact</a></li>
      </ul>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Get Started
      </button>
    </nav>
  );
}
