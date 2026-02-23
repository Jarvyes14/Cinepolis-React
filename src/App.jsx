import { Routes, Route } from "react-router-dom";
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import Home from "./pages/Home.jsx";
import Cartelera from "./pages/Cartelera.jsx";
import Alimentos from "./pages/Alimentos.jsx";
import Otros from "./pages/Otros.jsx";
import Promos from "./pages/Promos.jsx";
import Especialidades from "./pages/Especialidades.jsx";
import Usuario from "./pages/Usuario.jsx";

function App() {

  return (
    <div 
      className="w-full h-screen flex flex-col overflow-hidden bg-[#030712]"
      style={{
        backgroundImage: `
          radial-gradient(circle at -10% 10%, rgba(37, 99, 235, 0.35) 0%, transparent 40%),
          radial-gradient(circle at 110% 90%, rgba(37, 99, 235, 0.35) 0%, transparent 40%)
        `
      }}
    >
      <Header></Header>
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cartelera" element={<Cartelera />} />
            <Route path="/alimentos" element={<Alimentos />} />
            <Route path="/otros" element={<Otros />} />
            <Route path="/promos" element={<Promos />} />
            <Route path="/especialidades" element={<Especialidades />} />
            <Route path="/usuario" element={<Usuario />} />
          </Routes>
        </div>
        <Footer></Footer>
      </div>
    </div>
  )
}

export default App
