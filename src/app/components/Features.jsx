export default function Features() {
  const items = [
    { title: "Cepat & Responsif", desc: "Website kami dioptimalkan agar cepat dan mudah digunakan." },
    { title: "Desain Modern", desc: "Tampilan elegan dan menarik untuk meningkatkan citra brand Anda." },
    { title: "SEO Friendly", desc: "Meningkatkan visibilitas website Anda di mesin pencari." },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10 text-blue-700">Fitur Unggulan</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className="p-6 shadow-lg rounded-xl hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
