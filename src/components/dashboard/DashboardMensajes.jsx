import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function DashboardMensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [loadingMensajes, setLoadingMensajes] = useState(false);

  useEffect(() => {
    fetchMensajes();
  }, []);

  const fetchMensajes = async () => {
    setLoadingMensajes(true);
    try {
      const querySnapshot = await getDocs(collection(db, "mensajes"));
      const mensajesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // Ordenar por fecha descendente
      mensajesData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setMensajes(mensajesData);
    } catch (error) {
      console.error("Error fetching mensajes: ", error);
    } finally {
      setLoadingMensajes(false);
    }
  };

  const handleToggleMensajeLeido = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "mensajes", id), { leido: !currentStatus });
      fetchMensajes();
    } catch (error) {
      console.error("Error updating mensaje: ", error);
    }
  };

  const handleDeleteMensaje = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este mensaje?")) {
      try {
        await deleteDoc(doc(db, "mensajes", id));
        fetchMensajes();
      } catch (error) {
        console.error("Error deleting mensaje: ", error);
      }
    }
  };

  return (
    <div className="bg-[#15274D] p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Buzón de Quejas y Sugerencias</h2>
      {loadingMensajes ? (
        <p>Cargando mensajes...</p>
      ) : mensajes.length === 0 ? (
        <p className="text-gray-400">No hay mensajes en el buzón.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {mensajes.map(mensaje => (
            <div key={mensaje.id} className={`p-4 rounded-xl border ${mensaje.leido ? 'bg-[#05102A] border-gray-700' : 'bg-[#1e3a8a] border-amber-400'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-white">{mensaje.asunto}</h3>
                  <p className="text-sm text-amber-300">{mensaje.userEmail}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleToggleMensajeLeido(mensaje.id, mensaje.leido)}
                    className={`text-xs px-3 py-1 rounded transition-colors font-bold ${mensaje.leido ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-amber-400 hover:bg-amber-300 text-[#05102A]'}`}
                  >
                    {mensaje.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                  </button>
                  <button 
                    onClick={() => handleDeleteMensaje(mensaje.id)}
                    className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <p className="text-gray-300 mt-3 bg-[#0a193a] p-3 rounded-lg">{mensaje.mensaje}</p>
              <p className="text-xs text-gray-500 mt-3 text-right">
                {new Date(mensaje.fecha).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
