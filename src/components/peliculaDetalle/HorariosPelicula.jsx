export default function HorariosPelicula({ horarios, handleSelectHorario }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Horarios Disponibles (Hoy)</h2>
      <div className="flex flex-wrap gap-3">
        {horarios.map((horario, index) => (
          <button
            key={index}
            onClick={() => handleSelectHorario(horario)}
            className="bg-[#15274D] hover:bg-amber-400 hover:text-[#05102A] text-white font-bold py-2 px-4 rounded-lg transition-colors border border-gray-600 hover:border-amber-400"
          >
            {horario}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-400 mt-3">
        * Selecciona un horario para continuar con la compra de boletos.
      </p>
    </div>
  );
}