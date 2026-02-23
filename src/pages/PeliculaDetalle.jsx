import { useLocation, useNavigate, Navigate } from "react-router-dom";

export default function PeliculaDetalle() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recuperamos la película del estado de la navegación
  const movie = location.state?.movie;

  // Si alguien entra a esta ruta directamente sin seleccionar película, lo regresamos a la cartelera
  if (!movie) {
    return <Navigate to="/cartelera" replace />;
  }

  // Horarios ficticios para la demostración
  const horarios = ["14:30", "16:45", "19:00", "21:15", "23:30"];

  const handleSelectHorario = (horario) => {
    navigate(`/comprar/${movie.id}`, { 
      state: { 
        movie: movie,
        horario: horario 
      } 
    });
  };

  return (
    <div className="flex flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-10 items-center text-white">
      <div className="w-full max-w-5xl bg-[#05102A] rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col gap-8">
        
        {/* Encabezado: Imagen y Detalles */}
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

            {/* Horarios */}
            <div>
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Horarios Disponibles (Hoy)</h2>
              <div className="flex flex-wrap gap-3">
                {horarios.map((horario, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectHorario(horario)}
                    className="bg-[#15274D] hover:bg-amber-400 hover:text-[#05102A] text-white font-bold py-2 px-4 rounded-lg transition-colors border border-gray-600 hover:border-amber-400"
                  >
                    {horario}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-3">
                * Selecciona un horario para continuar con la compra de boletos.
              </p>
            </div>
          </div>
        </div>

        {/* Trailer (Simulado con un div o iframe de YouTube) */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Tráiler Oficial</h2>
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center border border-gray-700 relative group cursor-pointer">
            {/* Aquí iría un iframe real de YouTube, por ahora ponemos un placeholder visual */}
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50 group-hover:scale-110 transition-transform">
                <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-white border-b-[15px] border-b-transparent ml-2"></div>
              </div>
            </div>
            <p className="absolute bottom-4 left-4 text-white font-bold bg-black/50 px-3 py-1 rounded-lg">
              Ver Tráiler - {movie.title}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}