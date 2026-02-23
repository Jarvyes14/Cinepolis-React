import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const PRECIOS = {
  adulto: 85,
  nino: 65,
  terceraEdad: 60
};

const FILAS = ['A', 'B', 'C', 'D', 'E', 'F'];
const COLUMNAS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function CompraBoletos() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recuperamos la película y el horario del estado de la navegación
  const movie = location.state?.movie;
  const horario = location.state?.horario;

  const [step, setStep] = useState(1);
  const [tickets, setTickets] = useState({ adulto: 0, nino: 0, terceraEdad: 0 });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Si alguien entra a esta ruta directamente sin seleccionar película, lo regresamos a la cartelera
  if (!movie) {
    return <Navigate to="/cartelera" replace />;
  }

  const totalTickets = tickets.adulto + tickets.nino + tickets.terceraEdad;
  const totalPrice = (tickets.adulto * PRECIOS.adulto) + (tickets.nino * PRECIOS.nino) + (tickets.terceraEdad * PRECIOS.terceraEdad);

  const handleTicketChange = (type, delta) => {
    setTickets(prev => {
      const newValue = prev[type] + delta;
      if (newValue < 0 || (totalTickets >= 10 && delta > 0)) return prev; // Máximo 10 boletos en total
      return { ...prev, [type]: newValue };
    });
  };

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length < totalTickets) {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const handleCompra = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para comprar boletos.");
      navigate("/usuario");
      return;
    }

    setIsProcessing(true);

    try {
      // Guardar la compra en Firestore
      await addDoc(collection(db, "compras"), {
        userId: user.uid,
        userEmail: user.email,
        movieId: movie.id,
        movieTitle: movie.title,
        horario: horario || "Sin horario",
        cantidad: totalTickets,
        desglose: tickets,
        asientos: selectedSeats,
        total: totalPrice,
        fechaCompra: new Date().toISOString()
      });

      alert(`¡Compra exitosa!\nPelícula: ${movie.title}\nHorario: ${horario || "N/A"}\nBoletos: ${totalTickets}\nAsientos: ${selectedSeats.join(", ")}\nTotal: $${totalPrice}`);
      navigate("/usuario"); // Redirigir al perfil después de comprar
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      alert("Hubo un error al procesar tu compra. Inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-10 items-center text-white">
      <div className="w-full max-w-4xl bg-[#05102A] rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row gap-8">
        
        {/* Resumen de la película */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <img 
            src={movie.image} 
            alt={movie.title} 
            className="w-64 h-auto rounded-xl shadow-md mb-6 object-cover"
          />
          <div className="bg-amber-300 px-2 py-1 rounded-md text-sm font-bold text-black mb-2">
            {movie.category}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{movie.title}</h1>
          {horario && (
            <div className="bg-[#15274D] px-4 py-2 rounded-lg border border-amber-400/30 mb-4 w-full">
              <p className="text-sm text-gray-400">Horario seleccionado:</p>
              <p className="text-xl font-bold text-amber-300">{horario}</p>
            </div>
          )}
          <p className="text-gray-400 text-sm mb-4 line-clamp-4">{movie.description}</p>
        </div>

        {/* Flujo de compra */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          
          {/* Paso 1: Boletos */}
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-700 pb-2">1. Selecciona tus boletos</h2>
              
              <div className="flex flex-col gap-4">
                {/* Adulto */}
                <div className="flex justify-between items-center bg-[#15274D] p-4 rounded-xl">
                  <div>
                    <p className="font-semibold">Adulto</p>
                    <p className="text-sm text-gray-400">${PRECIOS.adulto}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleTicketChange('adulto', -1)} className="bg-[#05102A] w-10 h-10 rounded-lg text-xl font-bold hover:bg-gray-700 transition-colors">-</button>
                    <span className="text-xl font-semibold w-6 text-center">{tickets.adulto}</span>
                    <button onClick={() => handleTicketChange('adulto', 1)} className="bg-[#05102A] w-10 h-10 rounded-lg text-xl font-bold hover:bg-gray-700 transition-colors">+</button>
                  </div>
                </div>

                {/* Niño */}
                <div className="flex justify-between items-center bg-[#15274D] p-4 rounded-xl">
                  <div>
                    <p className="font-semibold">Niño</p>
                    <p className="text-sm text-gray-400">${PRECIOS.nino}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleTicketChange('nino', -1)} className="bg-[#05102A] w-10 h-10 rounded-lg text-xl font-bold hover:bg-gray-700 transition-colors">-</button>
                    <span className="text-xl font-semibold w-6 text-center">{tickets.nino}</span>
                    <button onClick={() => handleTicketChange('nino', 1)} className="bg-[#05102A] w-10 h-10 rounded-lg text-xl font-bold hover:bg-gray-700 transition-colors">+</button>
                  </div>
                </div>

                {/* Tercera Edad */}
                <div className="flex justify-between items-center bg-[#15274D] p-4 rounded-xl">
                  <div>
                    <p className="font-semibold">Tercera Edad</p>
                    <p className="text-sm text-gray-400">${PRECIOS.terceraEdad}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleTicketChange('terceraEdad', -1)} className="bg-[#05102A] w-10 h-10 rounded-lg text-xl font-bold hover:bg-gray-700 transition-colors">-</button>
                    <span className="text-xl font-semibold w-6 text-center">{tickets.terceraEdad}</span>
                    <button onClick={() => handleTicketChange('terceraEdad', 1)} className="bg-[#05102A] w-10 h-10 rounded-lg text-xl font-bold hover:bg-gray-700 transition-colors">+</button>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-4 border-t border-gray-600 flex justify-between items-center">
                <span className="text-lg font-bold text-amber-300">Total: ${totalPrice}</span>
                <button 
                  onClick={() => setStep(2)} 
                  disabled={totalTickets === 0}
                  className={`px-6 py-3 rounded-xl font-bold transition-colors ${totalTickets > 0 ? 'bg-amber-400 text-[#05102A] hover:bg-amber-300' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 2: Asientos */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-700 pb-2">2. Selecciona tus asientos</h2>
              <p className="text-sm text-gray-300 text-center mb-2">
                Asientos seleccionados: <span className="font-bold text-amber-300">{selectedSeats.length}</span> de <span className="font-bold">{totalTickets}</span>
              </p>
              
              {/* Pantalla */}
              <div className="w-full h-8 bg-gradient-to-b from-gray-400 to-transparent rounded-t-full mb-6 opacity-50 flex justify-center items-start pt-1">
                <span className="text-xs text-gray-300 uppercase tracking-widest">Pantalla</span>
              </div>

              {/* Grid de asientos */}
              <div className="flex flex-col gap-2 items-center overflow-x-auto pb-4">
                {FILAS.map(fila => (
                  <div key={fila} className="flex gap-2 items-center">
                    <div className="flex gap-2">
                      {COLUMNAS.map(col => {
                        const seatId = `${fila}${col}`;
                        const isSelected = selectedSeats.includes(seatId);
                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeat(seatId)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-t-lg rounded-b-sm text-xs font-bold transition-colors ${
                              isSelected 
                                ? 'bg-amber-400 text-[#05102A]' 
                                : 'bg-[#15274D] text-gray-300 hover:bg-[#1e3a8a]'
                            }`}
                          >
                            {fila}{col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-4 border-t border-gray-600 flex justify-between items-center">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl font-bold bg-[#15274D] hover:bg-[#1e3a8a] transition-colors">
                  Volver
                </button>
                <button 
                  onClick={() => setStep(3)} 
                  disabled={selectedSeats.length !== totalTickets}
                  className={`px-6 py-3 rounded-xl font-bold transition-colors ${selectedSeats.length === totalTickets ? 'bg-amber-400 text-[#05102A] hover:bg-amber-300' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Confirmación */}
          {step === 3 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-2 border-b border-gray-700 pb-2">3. Confirmación de Compra</h2>
              
              <div className="bg-[#15274D] p-6 rounded-xl flex flex-col gap-4">
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Boletos ({totalTickets}):</p>
                  {tickets.adulto > 0 && <div className="flex justify-between text-sm"><span>Adulto x{tickets.adulto}</span><span>${tickets.adulto * PRECIOS.adulto}</span></div>}
                  {tickets.nino > 0 && <div className="flex justify-between text-sm"><span>Niño x{tickets.nino}</span><span>${tickets.nino * PRECIOS.nino}</span></div>}
                  {tickets.terceraEdad > 0 && <div className="flex justify-between text-sm"><span>Tercera Edad x{tickets.terceraEdad}</span><span>${tickets.terceraEdad * PRECIOS.terceraEdad}</span></div>}
                </div>

                <div className="border-t border-gray-600 pt-4">
                  <p className="text-sm text-gray-400 mb-1">Asientos seleccionados:</p>
                  <p className="font-semibold text-amber-300">{selectedSeats.join(', ')}</p>
                </div>

                {horario && (
                  <div className="border-t border-gray-600 pt-4">
                    <p className="text-sm text-gray-400 mb-1">Horario:</p>
                    <p className="font-semibold text-amber-300">{horario}</p>
                  </div>
                )}

                <div className="border-t border-gray-600 pt-4 flex justify-between items-center text-xl font-bold text-amber-300">
                  <span>Total a pagar:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <div className="mt-2 flex justify-between items-center gap-4">
                <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold bg-[#15274D] hover:bg-[#1e3a8a] transition-colors w-1/3">
                  Volver
                </button>
                <button 
                  onClick={handleCompra}
                  disabled={isProcessing}
                  className={`w-2/3 font-bold py-4 rounded-xl transition-colors shadow-lg ${
                    isProcessing 
                      ? "bg-gray-500 text-gray-300 cursor-not-allowed" 
                      : "bg-amber-400 text-[#05102A] hover:bg-amber-300 shadow-amber-400/20"
                  }`}
                >
                  {isProcessing ? "Procesando..." : "Confirmar Compra"}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
