export default function PasoBoletos({ tickets, handleTicketChange, PRECIOS, totalTickets, totalPrice, setStep }) {
  return (
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
  );
}
