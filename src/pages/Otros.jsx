const elementos = [
  {
    titulo: "Promociones",
    descripcion: "Descuentos semanales en boletos y combos seleccionados.",
  },
  {
    titulo: "Membresías",
    descripcion: "Acumula puntos y obtén beneficios exclusivos en cada visita.",
  },
  {
    titulo: "Preventas",
    descripcion: "Compra entradas anticipadas para estrenos más esperados.",
  },
  {
    titulo: "Formatos especiales",
    descripcion: "Funciones en IMAX, 4DX y salas VIP para una mejor experiencia.",
  },
];

export default function Otros() {
  return (
    <section className="px-10 py-8 text-white">
      <h1 className="text-2xl font-semibold">Otros</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {elementos.map((elemento) => (
          <article key={elemento.titulo} className="bg-[#05102A] rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-2">{elemento.titulo}</h2>
            <p className="text-white/85">{elemento.descripcion}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
