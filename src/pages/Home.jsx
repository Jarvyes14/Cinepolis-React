import Card from "../components/card.jsx";

const movies = [
  {
    category: "B15",
    title: "Misión Rescate",
    description: "Acción y suspenso con una misión contrarreloj.",
    image:
      "https://images.unsplash.com/photo-1596727147705-61a532a659bd?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "B15",
    title: "Ayuda",
    description: "Drama psicológico con giros inesperados.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "B",
    title: "Aún es de Noche en Caracas",
    description: "Historia intensa sobre identidad y supervivencia.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80",
  },
  {
    category: "B",
    title: "Hamnet",
    description: "Drama histórico sobre amor y pérdida.",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80",
  },
];

export default function Home() {
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
      <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Cartelera</h1>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
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
