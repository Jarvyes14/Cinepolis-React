import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Cartelera from "../pages/Cartelera.jsx";
import Alimentos from "../pages/Alimentos.jsx";
import Otros from "../pages/Otros.jsx";
import Promos from "../pages/Promos.jsx";
import Especialidades from "../pages/Especialidades.jsx";
import Usuario from "../pages/Usuario.jsx";
import CompraBoletos from "../pages/CompraBoletos.jsx";
import CompraAlimentos from "../pages/CompraAlimentos.jsx";
import PeliculaDetalle from "../pages/PeliculaDetalle.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Ticket from "../pages/Ticket.jsx";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cartelera" element={<Cartelera />} />
      <Route path="/alimentos" element={<Alimentos />} />
      <Route path="/otros" element={<Otros />} />
      <Route path="/promos" element={<Promos />} />
      <Route path="/especialidades" element={<Especialidades />} />
      <Route path="/usuario" element={<Usuario />} />
      <Route path="/pelicula/:id" element={<PeliculaDetalle />} />
      <Route path="/comprar/:id" element={<CompraBoletos />} />
      <Route path="/comprar-alimentos" element={<CompraAlimentos />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/ticket/:type/:id" element={<Ticket />} />
    </Routes>
  );
};
