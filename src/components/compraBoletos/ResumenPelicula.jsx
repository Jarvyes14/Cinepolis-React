export default function ResumenPelicula({ movie, horario }) {
  return (
    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
      <img 
        src={movie.image} 
        alt={movie.title} 
        className="w-64 h-auto rounded-xl shadow-md mb-6 object-cover"
      />
      <div className="bg-amber-300 px-2 py-1 rounded-md text-sm font-bold text-black mb-2">
        {movie.category}
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{movie.title}</h1>
      {horario && (
        <div className="bg-[#15274D] px-4 py-2 rounded-lg border border-amber-400/30 mb-4 w-full">
          <p className="text-sm text-gray-400">Horario seleccionado:</p>
          <p className="text-xl font-bold text-amber-300">{horario}</p>
        </div>
      )}
      <p className="text-gray-400 text-sm mb-4 line-clamp-4">{movie.description}</p>
    </div>
  );
}
