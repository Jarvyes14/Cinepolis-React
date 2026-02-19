export default function Alimentos() {
  const categorias = [
    {
      nombre: "Bebidas",
      items: [
        {
          nombre: "Refresco grande",
          imagen:
            "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=900&q=80",
        },
        {
          nombre: "Limonada natural",
          imagen:
            "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      nombre: "Comestibles",
      items: [
        {
          nombre: "Hot dog clásico",
          imagen:
            "https://images.unsplash.com/photo-1612392062798-4eb44ad14f4b?auto=format&fit=crop&w=900&q=80",
        },
        {
          nombre: "Nachos con queso",
          imagen:
            "https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
    {
      nombre: "Snacks o dulces",
      items: [
        {
          nombre: "Palomitas acarameladas",
          imagen:
            "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=900&q=80",
        },
        {
          nombre: "Chocolate relleno",
          imagen:
            "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80",
        },
      ],
    },
  ];

  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-10 text-white">
      <h1 className="text-2xl sm:text-3xl font-semibold">Alimentos</h1>
      <div className="mt-6 grid gap-6">
        {categorias.map((categoria) => (
          <article key={categoria.nombre}>
            <h2 className="text-xl font-semibold mb-4">{categoria.nombre}</h2>
            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {categoria.items.map((item) => (
                <li
                  key={item.nombre}
                  className="bg-[#05102A] rounded-xl p-4 flex flex-col gap-3"
                >
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-full h-40 rounded-lg object-cover"
                  />
                  <span className="font-medium">{item.nombre}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
