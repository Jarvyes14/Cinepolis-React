import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function DashboardMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    horarios: "",
    trailer: ""
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
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

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      const movieData = {
        ...movieForm,
        horarios: movieForm.horarios.split(",").map(h => h.trim()).filter(h => h !== "")
      };

      if (editingMovie) {
        const movieRef = doc(db, "movies", editingMovie.id);
        await updateDoc(movieRef, movieData);
        alert("Película actualizada correctamente");
      } else {
        await addDoc(collection(db, "movies"), movieData);
        alert("Película agregada correctamente");
      }
      setEditingMovie(null);
      setMovieForm({ title: "", description: "", image: "", category: "", horarios: "", trailer: "" });
      fetchMovies();
    } catch (error) {
      console.error("Error saving movie: ", error);
      alert("Error al guardar la película");
    }
  };

  const handleEditClick = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      description: movie.description,
      image: movie.image,
      category: movie.category,
      horarios: movie.horarios ? movie.horarios.join(", ") : "",
      trailer: movie.trailer || ""
    });
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta película?")) {
      try {
        await deleteDoc(doc(db, "movies", id));
        alert("Película eliminada");
        fetchMovies();
      } catch (error) {
        console.error("Error deleting movie: ", error);
        alert("Error al eliminar la película");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Formulario */}
      <div className="w-full lg:w-1/3 bg-[#15274D] p-6 rounded-xl h-fit">
        <h2 className="text-xl font-semibold mb-4">
          {editingMovie ? "Editar Película" : "Agregar Nueva Película"}
        </h2>
        <form onSubmit={handleMovieSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Título"
            value={movieForm.title}
            onChange={(e) => setMovieForm({...movieForm, title: e.target.value})}
            className="p-3 rounded-lg bg-[#05102A] text-white outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
          <input
            type="text"
            placeholder="Categoría (ej. Acción, Comedia)"
            value={movieForm.category}
            onChange={(e) => setMovieForm({...movieForm, category: e.target.value})}
            className="p-3 rounded-lg bg-[#05102A] text-white outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
          <input
            type="url"
            placeholder="URL de la Imagen"
            value={movieForm.image}
            onChange={(e) => setMovieForm({...movieForm, image: e.target.value})}
            className="p-3 rounded-lg bg-[#05102A] text-white outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
          <input
            type="text"
            placeholder="Horarios (ej: 14:30, 16:45)"
            value={movieForm.horarios}
            onChange={(e) => setMovieForm({...movieForm, horarios: e.target.value})}
            className="p-3 rounded-lg bg-[#05102A] text-white outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            type="text"
            placeholder="ID del Video de YouTube (ej: 3J9oVyDQC8U)"
            value={movieForm.trailer}
            onChange={(e) => setMovieForm({...movieForm, trailer: e.target.value})}
            className="p-3 rounded-lg bg-[#05102A] text-white outline-none focus:ring-2 focus:ring-amber-300"
          />
          <textarea
            placeholder="Sinopsis"
            value={movieForm.description}
            onChange={(e) => setMovieForm({...movieForm, description: e.target.value})}
            className="p-3 rounded-lg bg-[#05102A] text-white outline-none focus:ring-2 focus:ring-amber-300 min-h-[100px]"
            required
          />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="flex-1 bg-amber-400 text-[#05102A] font-bold py-3 rounded-lg hover:bg-amber-300 transition-colors">
              {editingMovie ? "Actualizar" : "Guardar"}
            </button>
            {editingMovie && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingMovie(null);
                  setMovieForm({ title: "", description: "", image: "", category: "", horarios: "", trailer: "" });
                }}
                className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Películas */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-xl font-semibold mb-4">Películas en Cartelera</h2>
        {loading ? (
          <p>Cargando películas...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {movies.map(movie => (
              <div key={movie.id} className="bg-[#15274D] p-4 rounded-xl flex gap-4">
                <img src={movie.image} alt={movie.title} className="w-24 h-36 object-cover rounded-lg" />
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-lg">{movie.title}</h3>
                    <p className="text-sm text-gray-400">{movie.category}</p>
                    <p className="text-xs text-amber-300 mt-1">
                      {movie.horarios ? movie.horarios.join(", ") : "Sin horarios"}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button 
                      onClick={() => handleEditClick(movie)}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-1 rounded transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white py-1 rounded transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
