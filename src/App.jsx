import { Routes, Route } from "react-router-dom";
import Header from './components/header.jsx'
import Home from "./pages/Home.jsx";
import Alimentos from "./pages/Alimentos.jsx";
import Otros from "./pages/Otros.jsx";
import Promos from "./pages/Promos.jsx";
import Especialidades from "./pages/Especialidades.jsx";

function App() {

  return (
    <div className="w-full min-h-screen bg-[#15274D]">
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alimentos" element={<Alimentos />} />
        <Route path="/otros" element={<Otros />} />
        <Route path="/promos" element={<Promos />} />
        <Route path="/especialidades" element={<Especialidades />} />
      </Routes>
    </div>
  )
}

export default App
