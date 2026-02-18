export default function Alimentos() {
  const categorias = [
    {
      nombre: "Bebidas",
      items: ["Refresco grande", "Limonada natural"],
    },
    {
      nombre: "Comestibles",
      items: ["Hot dog clásico", "Nachos con queso"],
    },
    {
      nombre: "Snacks o dulces",
      items: ["Palomitas acarameladas", "Chocolate relleno"],
    },
  ];

  return (
    <section className="px-10 py-8 text-white">
      <h1 className="text-2xl font-semibold">Alimentos</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {categorias.map((categoria) => (
          <article key={categoria.nombre} className="bg-[#05102A] rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-3">{categoria.nombre}</h2>
            <ul className="space-y-2 text-white/85">
              {categoria.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
