export default function EncabezadoPelicula({ movie }) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <img 
        src={movie.image} 
        alt={movie.title} 
        className="w-full md:w-1/3 h-auto rounded-xl shadow-md object-cover"
      />
      
      <div className="w-full md:w-2/3 flex flex-col">
        <div className="bg-amber-300 px-3 py-1 rounded-md text-sm font-bold text-black w-max mb-4">
          {movie.category}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{movie.title}</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 border-b border-gray-700 pb-2">Sinopsis</h2>
          <p className="text-gray-300 leading-relaxed text-justify">
            {movie.description}
            {/* Texto de relleno para simular una sinopsis más larga si la original es corta */}
            {movie.description.length < 100 && " Esta es una emocionante aventura que no te puedes perder. Acompaña a los protagonistas en un viaje lleno de acción, drama y momentos inolvidables. Descubre los secretos ocultos y vive la experiencia en la pantalla grande."}
          </p>
        </div>
      </div>
    </div>
  );
}