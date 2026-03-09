import { Link } from "react-router-dom";

export default function CineFanMembership({ user, userData, loadingUser, handleJoinMembership }) {
  return (
    <div className="bg-[#05102A] rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full -z-0"></div>
      <h2 className="text-2xl font-bold mb-2 relative z-10">CineFan Club</h2>
      <p className="text-gray-400 mb-6 relative z-10">Únete a nuestro programa de lealtad y obtén beneficios exclusivos.</p>
      
      {loadingUser ? (
        <p className="text-amber-300">Cargando información...</p>
      ) : !user ? (
        <div className="bg-[#15274D] p-4 rounded-xl text-center relative z-10">
          <p className="mb-4">Inicia sesión para unirte al club.</p>
          <Link to="/usuario" className="bg-amber-400 text-[#05102A] font-bold py-2 px-6 rounded-lg hover:bg-amber-300 transition-colors inline-block">
            Ir a Iniciar Sesión
          </Link>
        </div>
      ) : userData?.membership ? (
        <div className="bg-gradient-to-br from-[#15274D] to-[#0a193a] p-6 rounded-xl border border-amber-400/30 relative z-10 shadow-inner">
          <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Nivel Actual</p>
              <p className="text-2xl font-bold text-amber-400">{userData.level}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Puntos Acumulados</p>
              <p className="text-2xl font-bold text-white">{userData.points} pts</p>
            </div>
          </div>
          <p className="text-sm text-gray-300">¡Sigue comprando para subir a nivel Oro y obtener entradas 2x1 todos los martes!</p>
        </div>
      ) : (
        <div className="bg-[#15274D] p-6 rounded-xl text-center relative z-10">
          <p className="mb-4 text-gray-300">Aún no eres miembro. ¡Inscríbete gratis hoy y recibe 100 puntos de bienvenida!</p>
          <button 
            onClick={handleJoinMembership}
            className="w-full bg-amber-400 text-[#05102A] font-bold py-3 rounded-lg hover:bg-amber-300 transition-colors"
          >
            Unirme a CineFan
          </button>
        </div>
      )}
    </div>
  );
}
