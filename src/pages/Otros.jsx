const elementos = [
  {
    titulo: "Promociones",
    descripcion: "Descuentos semanales en boletos y combos seleccionados.",
    imagen:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    titulo: "Membresías",
    descripcion: "Acumula puntos y obtén beneficios exclusivos en cada visita.",
    imagen:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    titulo: "Preventas",
    descripcion: "Compra entradas anticipadas para estrenos más esperados.",
    imagen:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    titulo: "Formatos especiales",
    descripcion: "Funciones en IMAX, 4DX y salas VIP para una mejor experiencia.",
    imagen:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Otros() {
  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-10 text-white">
      <h1 className="text-2xl sm:text-3xl font-semibold">Otros</h1>
      <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
        {elementos.map((elemento) => (
          <article key={elemento.titulo} className="bg-[#05102A] rounded-xl p-4">
            <img
              src={elemento.imagen}
              alt={elemento.titulo}
              className="w-full h-40 rounded-lg object-cover mb-3"
            />
            <h2 className="text-xl font-semibold mb-2">{elemento.titulo}</h2>
            <p className="text-white/85">{elemento.descripcion}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
