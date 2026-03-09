import { Link } from "react-router-dom";

export default function MisEntradas({ compras, loadingCompras }) {
  return (
    <div className="bg-[#15274D] p-6 rounded-xl flex flex-col">
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Mis Entradas</h2>
      {loadingCompras ? (
        <p className="text-sm text-gray-400">Cargando entradas...</p>
      ) : compras.length > 0 ? (
        <div className="flex flex-col gap-4 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
          {compras.map((compra) => (
            <div key={compra.id} className="bg-[#05102A] p-4 rounded-lg border border-gray-700">
              <h3 className="font-bold text-amber-300">{compra.movieTitle}</h3>
              <div className="flex justify-between text-sm text-gray-300 mt-2">
                <span>Boletos: {compra.cantidad}</span>
                <span>Total: ${compra.total}</span>
              </div>
              {compra.asientos && compra.asientos.length > 0 && (
                <p className="text-sm text-gray-400 mt-1">
                  Asientos: <span className="text-white">{compra.asientos.join(', ')}</span>
                </p>
              )}
              {compra.horario && compra.horario !== "Sin horario" && (
                <p className="text-sm text-gray-400 mt-1">
                  Horario: <span className="text-white">{compra.horario}</span>
                </p>
              )}
              <div className="flex justify-between items-center mt-3 border-t border-gray-700 pt-2">
                <p className="text-xs text-gray-500">
                  {new Date(compra.fechaCompra).toLocaleDateString()} - {new Date(compra.fechaCompra).toLocaleTimeString()}
                </p>
                <Link 
                  to={`/ticket/entradas/${compra.id}`}
                  className="text-xs bg-amber-400 text-[#05102A] font-bold px-3 py-1 rounded hover:bg-amber-300 transition-colors"
                >
                  Ver Ticket
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Aún no has comprado entradas.</p>
      )}
    </div>
  );
}
