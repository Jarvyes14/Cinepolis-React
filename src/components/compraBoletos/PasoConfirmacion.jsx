export default function PasoConfirmacion({ totalTickets, tickets, PRECIOS, selectedSeats, horario, totalPrice, setStep, handleCompra, isProcessing }) {
  return (
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
  );
}
