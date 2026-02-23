import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CompraAlimentos() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recuperamos el carrito y el total del estado de la navegación
  const cart = location.state?.cart;
  const total = location.state?.total;

  const [isProcessing, setIsProcessing] = useState(false);

  // Si alguien entra a esta ruta directamente sin carrito, lo regresamos a alimentos
  if (!cart || cart.length === 0) {
    return <Navigate to="/alimentos" replace />;
  }

  const handleCompra = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Debes iniciar sesión para comprar alimentos.");
      navigate("/usuario");
      return;
    }

    setIsProcessing(true);

    try {
      // Guardar la compra en Firestore
      await addDoc(collection(db, "compras_alimentos"), {
        userId: user.uid,
        userEmail: user.email,
        items: cart.map(item => ({
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.quantity,
          opcion: item.selectedOption || "N/A"
        })),
        total: total,
        fechaCompra: new Date().toISOString()
      });

      alert(`¡Compra exitosa!\nTotal pagado: $${total}\nPuedes recoger tus alimentos en dulcería.`);
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
      <div className="w-full max-w-3xl bg-[#05102A] rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col gap-8">
        
        <h1 className="text-3xl font-bold text-amber-400 border-b border-gray-700 pb-4 text-center">
          Resumen de tu Pedido
        </h1>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Artículos:</h2>
          <div className="bg-[#15274D] rounded-xl p-4 flex flex-col gap-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-bold text-lg">{item.nombre}</h3>
                    {item.selectedOption && (
                      <p className="text-sm text-gray-400">Opción: {item.selectedOption}</p>
                    )}
                    <p className="text-sm text-amber-400">Cantidad: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-xl font-bold">
                  ${item.precio * item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 border-t border-gray-700 pt-6">
          <div className="text-2xl font-bold flex gap-4">
            <span>Total a Pagar:</span>
            <span className="text-amber-400">${total}</span>
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto mt-4">
            <button 
              onClick={() => navigate("/alimentos")}
              className="flex-1 sm:flex-none bg-gray-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-500 transition-colors"
              disabled={isProcessing}
            >
              Volver
            </button>
            <button 
              onClick={handleCompra}
              disabled={isProcessing}
              className={`flex-1 sm:flex-none bg-amber-400 text-[#05102A] font-bold py-3 px-8 rounded-lg transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-300'}`}
            >
              {isProcessing ? "Procesando..." : "Confirmar Compra"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
