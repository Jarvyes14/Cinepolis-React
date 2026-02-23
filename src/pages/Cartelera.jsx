import { useState, useEffect } from "react";
import Card from "../components/card.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Cartelera() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "movies"));
      const moviesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMovies(moviesData);
    } catch (error) {
      console.error("Error fetching movies: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="flex flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-10 items-center">
      
      {loading ? (
        <p className="text-white">Cargando películas...</p>
      ) : movies.length === 0 ? (
        <div className="text-center">
          <p className="text-white mb-4">No hay películas en la base de datos.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {movies.map((movie) => (
            <Card
              key={movie.id}
              id={movie.id}
              category={movie.category}
              title={movie.title}
              description={movie.description}
              image={movie.image}
              horarios={movie.horarios}
              trailer={movie.trailer}
            ></Card>
          ))}
        </div>
      )}
    </div>
  );
}
