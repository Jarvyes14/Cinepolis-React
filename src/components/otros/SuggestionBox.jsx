import { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function SuggestionBox({ user }) {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!asunto.trim() || !mensaje.trim()) return;
    
    setIsSending(true);
    try {
      await addDoc(collection(db, "mensajes"), {
        userId: user ? user.uid : "Anónimo",
        userEmail: user ? user.email : "Anónimo",
        asunto,
        mensaje,
        fecha: new Date().toISOString(),
        leido: false
      });
      setAsunto("");
      setMensaje("");
      alert("¡Mensaje enviado correctamente! Nuestro equipo lo revisará pronto.");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Hubo un error al enviar el mensaje.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#05102A] rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-800 h-full">
      <h2 className="text-2xl font-bold mb-2">Buzón de Sugerencias</h2>
      <p className="text-gray-400 mb-6">¿Tienes alguna queja, duda o sugerencia? Escríbenos y te responderemos a la brevedad.</p>
      
      <form onSubmit={handleSendMessage} className="flex flex-col gap-4 h-full">
        {!user && (
          <div className="bg-blue-900/30 border border-blue-500/50 text-blue-200 p-3 rounded-lg text-sm mb-2">
            Estás enviando este mensaje como invitado. Si deseas que te contactemos, por favor inicia sesión.
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          <label htmlFor="asunto" className="text-sm font-semibold text-gray-300">Asunto</label>
          <input
            id="asunto"
            type="text"
            placeholder="Ej. Problema con mi compra"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            className="p-3 rounded-lg bg-[#15274D] text-white outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
        </div>
        
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="mensaje" className="text-sm font-semibold text-gray-300">Mensaje</label>
          <textarea
            id="mensaje"
            placeholder="Escribe aquí tu mensaje detallado..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="p-3 rounded-lg bg-[#15274D] text-white outline-none focus:ring-2 focus:ring-amber-300 min-h-[150px] flex-1 resize-none"
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSending}
          className={`mt-2 bg-amber-400 text-[#05102A] font-bold py-3 rounded-lg transition-colors ${isSending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-300'}`}
        >
          {isSending ? "Enviando..." : "Enviar Mensaje"}
        </button>
      </form>
    </div>
  );
}
