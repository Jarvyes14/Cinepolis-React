import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

import { Link } from "react-router-dom";

export default function Usuario() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [compras, setCompras] = useState([]);
  const [comprasAlimentos, setComprasAlimentos] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        fetchCompras(currentUser.uid);
        fetchComprasAlimentos(currentUser.uid);
      } else {
        setCompras([]);
        setComprasAlimentos([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchCompras = async (userId) => {
    setLoadingCompras(true);
    try {
      const q = query(
        collection(db, "compras"), 
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const comprasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordenar por fecha de compra descendente en memoria para evitar requerir un índice compuesto en Firestore
      comprasData.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));
      
      setCompras(comprasData);
    } catch (error) {
      console.error("Error al obtener compras:", error);
    } finally {
      setLoadingCompras(false);
    }
  };

  const fetchComprasAlimentos = async (userId) => {
    try {
      const q = query(
        collection(db, "compras_alimentos"), 
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const comprasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      comprasData.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));
      
      setComprasAlimentos(comprasData);
    } catch (error) {
      console.error("Error al obtener compras de alimentos:", error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Guardar el usuario en Firestore para poder listarlo en el dashboard
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: new Date().toISOString(),
          role: userCredential.user.email === "jarvyes@gmail.com" ? "admin" : "user"
        });
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Cargando...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-10 items-center text-white">
        <div className="w-full max-w-md bg-[#05102A] rounded-2xl p-6 sm:p-10 shadow-lg">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg bg-[#15274D] text-white outline-none focus:ring-2 focus:ring-amber-300"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded-lg bg-[#15274D] text-white outline-none focus:ring-2 focus:ring-amber-300"
              required
            />
            <button type="submit" className="bg-amber-400 text-[#05102A] font-bold py-3 rounded-lg hover:bg-amber-300 transition-colors mt-2">
              {isLogin ? "Entrar" : "Registrarse"}
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-gray-400">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-amber-300 hover:underline">
              {isLogin ? "Regístrate aquí" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-10 items-center text-white">
      <div className="w-full max-w-3xl bg-[#05102A] rounded-2xl p-6 sm:p-10 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-700 pb-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#15274D] rounded-full flex items-center justify-center text-4xl font-bold text-amber-300 uppercase">
            {user.email.charAt(0)}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-2">Usuario</h1>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-sm text-amber-300 mt-2">Conectado</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#15274D] p-6 rounded-xl flex flex-col">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Mis Entradas</h2>
            {loadingCompras ? (
              <p className="text-sm text-gray-400">Cargando entradas...</p>
            ) : compras.length > 0 ? (
              <div className="flex flex-col gap-4 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                {compras.map((compra) => (
                  <div key={compra.id} className="bg-[#05102A] p-4 rounded-lg border border-gray-700">
                    <h3 className="font-bold text-amber-300">{compra.movieTitle}</h3>
                    <div className="flex justify-between text-sm text-gray-300 mt-2">
                      <span>Boletos: {compra.cantidad}</span>
                      <span>Total: ${compra.total}</span>
                    </div>
                    {compra.asientos && compra.asientos.length > 0 && (
                      <p className="text-sm text-gray-400 mt-1">
                        Asientos: <span className="text-white">{compra.asientos.join(', ')}</span>
                      </p>
                    )}
                    {compra.horario && compra.horario !== "Sin horario" && (
                      <p className="text-sm text-gray-400 mt-1">
                        Horario: <span className="text-white">{compra.horario}</span>
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-3 border-t border-gray-700 pt-2">
                      <p className="text-xs text-gray-500">
                        {new Date(compra.fechaCompra).toLocaleDateString()} - {new Date(compra.fechaCompra).toLocaleTimeString()}
                      </p>
                      <Link 
                        to={`/ticket/entradas/${compra.id}`}
                        className="text-xs bg-amber-400 text-[#05102A] font-bold px-3 py-1 rounded hover:bg-amber-300 transition-colors"
                      >
                        Ver Ticket
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Aún no has comprado entradas.</p>
            )}
          </div>

          <div className="bg-[#15274D] p-6 rounded-xl flex flex-col">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Mis Alimentos</h2>
            {loadingCompras ? (
              <p className="text-sm text-gray-400">Cargando alimentos...</p>
            ) : comprasAlimentos.length > 0 ? (
              <div className="flex flex-col gap-4 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                {comprasAlimentos.map((compra) => (
                  <div key={compra.id} className="bg-[#05102A] p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span className="font-bold text-amber-300">Pedido</span>
                      <span className="font-bold text-amber-400">${compra.total}</span>
                    </div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {compra.items?.map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.cantidad}x {item.nombre} {item.opcion !== "N/A" ? `(${item.opcion})` : ""}</span>
                          <span>${item.precio * item.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center mt-3 border-t border-gray-700 pt-2">
                      <p className="text-xs text-gray-500">
                        {new Date(compra.fechaCompra).toLocaleDateString()} - {new Date(compra.fechaCompra).toLocaleTimeString()}
                      </p>
                      <Link 
                        to={`/ticket/alimentos/${compra.id}`}
                        className="text-xs bg-amber-400 text-[#05102A] font-bold px-3 py-1 rounded hover:bg-amber-300 transition-colors"
                      >
                        Ver Ticket
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Aún no has comprado alimentos.</p>
            )}
          </div>

          <div className="bg-[#15274D] p-6 rounded-xl md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Ajustes de Cuenta</h2>
            <ul className="flex flex-wrap gap-6">
              <li>
                <button className="text-sm hover:text-amber-300 transition-colors">Editar Perfil</button>
              </li>
              {user.email === "jarvyes@gmail.com" && (
                <li>
                  <Link to="/dashboard" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                    Dashboard de Administrador
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">Cerrar Sesión</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
