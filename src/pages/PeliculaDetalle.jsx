import { useState, useEffect } from "react";
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import EncabezadoPelicula from "../components/peliculaDetalle/EncabezadoPelicula";
import HorariosPelicula from "../components/peliculaDetalle/HorariosPelicula";
import TrailerPelicula from "../components/peliculaDetalle/TrailerPelicula";

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
  }, [id, navigate, movie]);

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

  return (
    <div className="flex flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-10 items-center text-white">
      <div className="w-full max-w-5xl bg-[#05102A] rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col gap-8">
        
        {/* Encabezado: Imagen y Detalles */}
        <div className="flex flex-col md:flex-row gap-8">
          <EncabezadoPelicula movie={movie} />
          
          <div className="w-full md:w-2/3 flex flex-col">
            {/* Horarios */}
            <HorariosPelicula horarios={horarios} handleSelectHorario={handleSelectHorario} />
          </div>
        </div>

        {/* Trailer */}
        <TrailerPelicula movie={movie} />

      </div>
    </div>
  );
}