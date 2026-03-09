import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import CineFanMembership from "../components/otros/CineFanMembership";
import FAQ from "../components/otros/FAQ";
import SuggestionBox from "../components/otros/SuggestionBox";

export default function Otros() {
  // Estados para Membresía
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const handleJoinMembership = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        membership: true,
        points: 100, // Puntos de bienvenida
        level: "Plata"
      });
      setUserData({ ...userData, membership: true, points: 100, level: "Plata" });
      alert("¡Felicidades! Ahora eres miembro CineFan. Te hemos regalado 100 puntos de bienvenida.");
    } catch (error) {
      console.error("Error joining membership:", error);
      alert("Hubo un error al procesar tu solicitud.");
    }
  };

  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-10 text-white max-w-6xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-amber-400 border-b border-gray-700 pb-4">
        Extras y Servicios
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="flex flex-col gap-8">
          
          {/* 1. SISTEMA DE MEMBRESÍAS */}
          <CineFanMembership 
            user={user} 
            userData={userData} 
            loadingUser={loadingUser} 
            handleJoinMembership={handleJoinMembership} 
          />

          {/* 4. PREGUNTAS FRECUENTES (FAQ) */}
          <FAQ />

        </div>

        {/* COLUMNA DERECHA */}
        <div className="flex flex-col gap-8">
          
          {/* 5. BUZÓN DE QUEJAS Y SUGERENCIAS */}
          <SuggestionBox user={user} />

        </div>
      </div>
    </section>
  );
}
