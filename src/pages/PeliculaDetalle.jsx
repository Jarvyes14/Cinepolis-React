import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function PeliculaDetalle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!location.state?.movie);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movie && id) {
        try {
          const docRef = doc(db, "movies", id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setMovie({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.log("No such document!");
            navigate("/cartelera", { replace: true });
          }
        } catch (error) {
          console.error("Error fetching movie:", error);
        } finally {
          setLoading(false);
        }
      } else if (movie) {
        // Si ya tenemos la película del state, pero queremos asegurarnos de tener los datos más recientes
        // (opcional, pero útil si se editó en el dashboard recientemente)
        try {
          const docRef = doc(db, "movies", movie.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setMovie({ id: docSnap.id, ...docSnap.data() });
          }
        } catch (error) {
          console.error("Error updating movie data:", error);
        }
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, navigate, movie?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <p className="text-2xl">Cargando detalles de la película...</p>
      </div>
    );
  }

  if (!movie) {
    return <Navigate to="/cartelera" replace />;
  }

  // Usar horarios de la base de datos si existen, si no, usar los por defecto
  const horarios = movie.horarios && movie.horarios.length > 0 
    ? movie.horarios 
    : ["14:30", "16:45", "19:00", "21:15", "23:30"];

  const handleSelectHorario = (horario) => {
    navigate(`/comprar/${movie.id}`, { 
      state: { 
        movie: movie,
        horario: horario 
      } 
    });
  };

  console.log("ID del trailer:", movie.trailer);
  console.log("URL generada:", `https://www.youtube.com/embed/${movie.trailer}`);

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

        {/* Trailer */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Tráiler Oficial</h2>
          <div className="bg-black rounded-xl overflow-hidden flex items-center justify-center border border-gray-700 relative group aspect-video">
            {movie.trailer ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${movie.trailer}`} 
                title={`Tráiler de ${movie.title}`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-gray-500 flex flex-col items-center">
                  <span className="text-4xl mb-2">🎬</span>
                  <p>Tráiler no disponible</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}