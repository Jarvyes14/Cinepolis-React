import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

import AuthForm from "../components/usuario/AuthForm";
import MisEntradas from "../components/usuario/MisEntradas";
import MisAlimentos from "../components/usuario/MisAlimentos";
import AjustesCuenta from "../components/usuario/AjustesCuenta";

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
      <AuthForm 
        isLogin={isLogin} 
        setIsLogin={setIsLogin} 
        email={email} 
        setEmail={setEmail} 
        password={password} 
        setPassword={setPassword} 
        handleAuth={handleAuth} 
      />
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
          <MisEntradas compras={compras} loadingCompras={loadingCompras} />
          <MisAlimentos comprasAlimentos={comprasAlimentos} loadingCompras={loadingCompras} />
          <AjustesCuenta user={user} handleLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
}
