import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Alimentos() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategorias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "alimentos"));
      const categoriasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategorias(categoriasData);
    } catch (error) {
      console.error("Error fetching alimentos: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-10 text-white">
      <h1 className="text-2xl sm:text-3xl font-semibold">Alimentos</h1>
      
      {loading ? (
        <p className="mt-6">Cargando alimentos...</p>
      ) : categorias.length === 0 ? (
        <div className="mt-6 text-center">
          <p className="mb-4">No hay alimentos en la base de datos.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6">
          {categorias.map((categoria) => (
            <article key={categoria.id || categoria.nombre}>
              <h2 className="text-xl font-semibold mb-4">{categoria.nombre}</h2>
              <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {categoria.items.map((item) => (
                  <li
                    key={item.nombre}
                    className="bg-[#05102A] rounded-xl p-4 flex flex-col gap-3"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-40 rounded-lg object-cover"
                    />
                    <span className="font-medium">{item.nombre}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
