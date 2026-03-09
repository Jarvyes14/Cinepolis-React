import { Link } from "react-router-dom";

export default function MisAlimentos({ comprasAlimentos, loadingCompras }) {
  return (
    <div className="bg-[#15274D] p-6 rounded-xl flex flex-col">
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Mis Alimentos</h2>
      {loadingCompras ? (
        <p className="text-sm text-gray-400">Cargando alimentos...</p>
      ) : comprasAlimentos.length > 0 ? (
        <div className="flex flex-col gap-4 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
          {comprasAlimentos.map((compra) => (
            <div key={compra.id} className="bg-[#05102A] p-4 rounded-lg border border-gray-700">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span className="font-bold text-amber-300">Pedido</span>
                <span className="font-bold text-amber-400">${compra.total}</span>
              </div>
              <ul className="text-sm text-gray-400 space-y-1">
                {compra.items?.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.cantidad}x {item.nombre} {item.opcion !== "N/A" ? `(${item.opcion})` : ""}</span>
                    <span>${item.precio * item.cantidad}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-3 border-t border-gray-700 pt-2">
                <p className="text-xs text-gray-500">
                  {new Date(compra.fechaCompra).toLocaleDateString()} - {new Date(compra.fechaCompra).toLocaleTimeString()}
                </p>
                <Link 
                  to={`/ticket/alimentos/${compra.id}`}
                  className="text-xs bg-amber-400 text-[#05102A] font-bold px-3 py-1 rounded hover:bg-amber-300 transition-colors"
                >
                  Ver Ticket
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Aún no has comprado alimentos.</p>
      )}
    </div>
  );
}
