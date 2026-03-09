import { Link } from "react-router-dom";

export default function AjustesCuenta({ user, handleLogout }) {
  return (
    <div className="bg-[#15274D] p-6 rounded-xl md:col-span-2">
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">Ajustes de Cuenta</h2>
      <ul className="flex flex-wrap gap-6">
        <li>
          <button className="text-sm hover:text-amber-300 transition-colors">Editar Perfil</button>
        </li>
        {user.email === "jarvyes@gmail.com" && (
          <li>
            <Link to="/dashboard" className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
              Dashboard de Administrador
            </Link>
          </li>
        )}
        <li>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">Cerrar Sesión</button>
        </li>
      </ul>
    </div>
  );
}
