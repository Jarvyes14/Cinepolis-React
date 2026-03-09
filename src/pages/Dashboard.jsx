import { useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import DashboardMovies from "../components/dashboard/DashboardMovies";
import DashboardAlimentos from "../components/dashboard/DashboardAlimentos";
import DashboardUsuarios from "../components/dashboard/DashboardUsuarios";
import DashboardMensajes from "../components/dashboard/DashboardMensajes";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("movies");

  // Verificar si es el administrador
  const user = auth.currentUser;
  const isAdmin = user && user.email === "jarvyes@gmail.com";

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
        <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab("movies")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === "movies" ? "bg-amber-400 text-[#05102A]" : "bg-[#15274D] hover:bg-[#1e3a8a]"}`}
          >
            Películas y Horarios
          </button>
          <button 
            onClick={() => setActiveTab("alimentos")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === "alimentos" ? "bg-amber-400 text-[#05102A]" : "bg-[#15274D] hover:bg-[#1e3a8a]"}`}
          >
            Alimentos
          </button>
          <button 
            onClick={() => setActiveTab("usuarios")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === "usuarios" ? "bg-amber-400 text-[#05102A]" : "bg-[#15274D] hover:bg-[#1e3a8a]"}`}
          >
            Usuarios
          </button>
          <button 
            onClick={() => setActiveTab("mensajes")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${activeTab === "mensajes" ? "bg-amber-400 text-[#05102A]" : "bg-[#15274D] hover:bg-[#1e3a8a]"}`}
          >
            Mensajes
          </button>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === "movies" && <DashboardMovies />}
        {activeTab === "alimentos" && <DashboardAlimentos />}
        {activeTab === "usuarios" && <DashboardUsuarios />}
        {activeTab === "mensajes" && <DashboardMensajes />}

      </div>
    </div>
  );
}