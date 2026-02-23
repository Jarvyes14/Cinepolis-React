import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import QRCode from "react-qr-code";

export default function Ticket() {
  const { type, id } = useParams();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const collectionName = type === "alimentos" ? "compras_alimentos" : "compras";
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTicketData(docSnap.data());
        } else {
          setError("Ticket no encontrado");
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Error al cargar el ticket");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [type, id]);

  if (loading) {
    return <div className="text-white text-center mt-20">Cargando ticket...</div>;
  }

  if (error || !ticketData) {
    return (
      <div className="text-white text-center mt-20 flex flex-col items-center gap-4">
        <p className="text-red-400 text-xl">{error}</p>
        <Link to="/usuario" className="text-amber-400 hover:underline">Volver a mi perfil</Link>
      </div>
    );
  }

  const ticketUrl = window.location.href;

  return (
    <div className="flex flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-10 items-center text-white min-h-screen">
      <div className="w-full max-w-md bg-white text-black rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header del Ticket */}
        <div className="bg-[#05102A] text-amber-400 p-6 text-center border-b-4 border-amber-400 border-dashed">
          <h1 className="text-3xl font-bold uppercase tracking-widest">CINE APP</h1>
          <p className="text-sm text-gray-300 mt-1">Ticket de Compra</p>
        </div>

        {/* Cuerpo del Ticket */}
        <div className="p-8 flex flex-col gap-6">
          {type === "entradas" ? (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{ticketData.movieTitle}</h2>
                <p className="text-gray-500 mt-1">{ticketData.horario !== "Sin horario" ? ticketData.horario : "Horario abierto"}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm border-y border-gray-200 py-4">
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold">Boletos</p>
                  <p className="font-semibold text-lg">{ticketData.cantidad}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold">Asientos</p>
                  <p className="font-semibold text-lg">{ticketData.asientos?.join(", ") || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold">Fecha de Compra</p>
                  <p className="font-semibold">{new Date(ticketData.fechaCompra).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold">Total Pagado</p>
                  <p className="font-semibold text-lg text-green-600">${ticketData.total}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Dulcería</h2>
                <p className="text-gray-500 mt-1">Pedido de Alimentos</p>
              </div>
              
              <div className="border-y border-gray-200 py-4">
                <p className="text-gray-500 uppercase text-xs font-bold mb-2">Artículos</p>
                <ul className="space-y-2">
                  {ticketData.items?.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm font-semibold">
                      <span>{item.cantidad}x {item.nombre} {item.opcion !== "N/A" ? `(${item.opcion})` : ""}</span>
                      <span>${item.precio * item.cantidad}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold">Fecha de Compra</p>
                  <p className="font-semibold">{new Date(ticketData.fechaCompra).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-xs font-bold">Total Pagado</p>
                  <p className="font-semibold text-lg text-green-600">${ticketData.total}</p>
                </div>
              </div>
            </>
          )}

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center mt-4">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <QRCode value={ticketUrl} size={150} />
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">Escanea este código para validar tu compra</p>
            <p className="text-[10px] text-gray-300 mt-1 font-mono">{id}</p>
          </div>
        </div>
      </div>

      <Link to="/usuario" className="mt-8 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors">
        Volver a mi perfil
      </Link>
    </div>
  );
}
