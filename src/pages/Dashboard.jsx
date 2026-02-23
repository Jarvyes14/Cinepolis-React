import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el formulario de películas
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    horarios: "",
    trailer: ""
  });

  // Estado para usuarios
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Verificar si es el administrador
  const user = auth.currentUser;
  const isAdmin = user && user.email === "jarvyes@gmail.com";

  useEffect(() => {
    if (isAdmin) {
      fetchMovies();
    }
  }, [isAdmin]);

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

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users: ", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "usuarios" && users.length === 0) {
      fetchUsers();
    }
  }, [activeTab, users.length]);

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      const movieData = {
        ...movieForm,
        horarios: movieForm.horarios.split(",").map(h => h.trim()).filter(h => h !== "")
      };

      if (editingMovie) {
        // Actualizar película existente
        const movieRef = doc(db, "movies", editingMovie.id);
        await updateDoc(movieRef, movieData);
        alert("Película actualizada correctamente");
      } else {
        // Crear nueva película
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

  if (!isAdmin) {
    return <Navigate to="/usuario" replace />;
  }

  return (
    <div className="flex flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-10 items-center text-white">
      <div className="w-full max-w-6xl bg-[#05102A] rounded-2xl p-6 sm:p-10 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-amber-400 border-b border-gray-700 pb-4">
          Dashboard de Administrador
        </h1>

        {/* Pestañas de navegación */}
        <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4">
          <button 
            onClick={() => setActiveTab("movies")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === "movies" ? "bg-amber-400 text-[#05102A]" : "bg-[#15274D] hover:bg-[#1e3a8a]"}`}
          >
            Películas y Horarios
          </button>
          <button 
            onClick={() => setActiveTab("usuarios")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === "usuarios" ? "bg-amber-400 text-[#05102A]" : "bg-[#15274D] hover:bg-[#1e3a8a]"}`}
          >
            Usuarios
          </button>
        </div>

        {/* Contenido de Películas */}
        {activeTab === "movies" && (
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
              <h2 className="text-xl font-semibold mb-4">Películas en Base de Datos</h2>
              {loading ? (
                <p>Cargando películas...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movies.map(movie => (
                    <div key={movie.id} className="bg-[#15274D] p-4 rounded-xl flex gap-4 items-center">
                      <img src={movie.image} alt={movie.title} className="w-16 h-24 object-cover rounded-md" />
                      <div className="flex-1">
                        <h3 className="font-bold text-amber-300 line-clamp-1">{movie.title}</h3>
                        <p className="text-xs text-gray-400 mb-1">{movie.category}</p>
                        <p className="text-xs text-gray-300 mb-2">
                          Horarios: {movie.horarios && movie.horarios.length > 0 ? movie.horarios.join(", ") : "No asignados"}
                        </p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditClick(movie)}
                            className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition-colors"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDeleteMovie(movie.id)}
                            className="text-xs bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition-colors"
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
        )}

        {activeTab === "usuarios" && (
          <div className="bg-[#15274D] p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Usuarios Registrados</h2>
            {loadingUsers ? (
              <p>Cargando usuarios...</p>
            ) : users.length === 0 ? (
              <p className="text-gray-400">No hay usuarios registrados o no se han guardado en la colección 'users'.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-600 text-amber-300">
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Rol</th>
                      <th className="py-3 px-4">Fecha de Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-gray-700 hover:bg-[#1e3a8a] transition-colors">
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-amber-400 text-[#05102A]' : 'bg-gray-600 text-white'}`}>
                            {u.role === 'admin' ? 'Administrador' : 'Usuario'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Desconocida'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}