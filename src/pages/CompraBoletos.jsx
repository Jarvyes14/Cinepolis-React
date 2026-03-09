import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

import ResumenPelicula from "../components/compraBoletos/ResumenPelicula";
import PasoBoletos from "../components/compraBoletos/PasoBoletos";
import PasoAsientos from "../components/compraBoletos/PasoAsientos";
import PasoConfirmacion from "../components/compraBoletos/PasoConfirmacion";

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
        <ResumenPelicula movie={movie} horario={horario} />

        {/* Flujo de compra */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          
          {/* Paso 1: Boletos */}
          {step === 1 && (
            <PasoBoletos 
              tickets={tickets} 
              handleTicketChange={handleTicketChange} 
              PRECIOS={PRECIOS} 
              totalTickets={totalTickets} 
              totalPrice={totalPrice} 
              setStep={setStep} 
            />
          )}

          {/* Paso 2: Asientos */}
          {step === 2 && (
            <PasoAsientos 
              selectedSeats={selectedSeats} 
              totalTickets={totalTickets} 
              FILAS={FILAS} 
              COLUMNAS={COLUMNAS} 
              toggleSeat={toggleSeat} 
              setStep={setStep} 
            />
          )}

          {/* Paso 3: Confirmación */}
          {step === 3 && (
            <PasoConfirmacion 
              totalTickets={totalTickets} 
              tickets={tickets} 
              PRECIOS={PRECIOS} 
              selectedSeats={selectedSeats} 
              horario={horario} 
              totalPrice={totalPrice} 
              setStep={setStep} 
              handleCompra={handleCompra} 
              isProcessing={isProcessing} 
            />
          )}

        </div>

      </div>
    </div>
  );
}
