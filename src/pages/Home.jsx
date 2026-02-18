import Card from "../components/card.jsx";

const movies = [
  {
    category: "B15",
    title: "Misión Rescate",
    description: "Acción y suspenso con una misión contrarreloj.",
    image: "https://tickets-static-content.cinepolis.com/pimcore/12880/assets/Mexico/Tickets/Movies/ElDiaDelFinDelMundo/Es/Poster_720x1022_G2_92/resource.jpg",
  },
  {
    category: "B15",
    title: "Ayuda",
    description: "Drama psicológico con giros inesperados.",
    image: "https://tickets-static-content.cinepolis.com/pimcore/13029/assets/Mexico/Tickets/Movies/Ayuda/Es/GC_Ayuda_720x1022px_32/resource.jpg",
  },
  {
    category: "B",
    title: "Aún es de Noche en Caracas",
    description: "Historia intensa sobre identidad y supervivencia.",
    image: "https://tickets-static-content.cinepolis.com/pimcore/13858/assets/Mexico/Tickets/Movies/AunEsDeNocheEnCaracas/Es/AENC_DESKTOP_P_ster_720x1022px_29/resource.jpg",
  },
  {
    category: "B",
    title: "Hamnet",
    description: "Drama histórico sobre amor y pérdida.",
    image: "https://tickets-static-content.cinepolis.com/pimcore/12398/assets/Mexico/Tickets/Movies/Hamnet/Es/720x1022_px_50/resource.jpg",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col m-10">
      <h1 className="text-3xl font-semibold text-white mb-6">Cartelera</h1>
      <div className="flex flex-wrap gap-6 justify-left justify-evenly">
        {movies.map((movie, index) => (
          <Card
            key={index}
            category={movie.category}
            title={movie.title}
            description={movie.description}
            image={movie.image}
          ></Card>
        ))}
      </div>
    </div>
  );
}
