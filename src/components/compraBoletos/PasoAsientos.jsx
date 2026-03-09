export default function PasoAsientos({ selectedSeats, totalTickets, FILAS, COLUMNAS, toggleSeat, setStep }) {
  return (
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
  );
}
