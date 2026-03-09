export default function AuthForm({ isLogin, setIsLogin, email, setEmail, password, setPassword, handleAuth }) {
  return (
    <div className="flex flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-10 items-center text-white">
      <div className="w-full max-w-md bg-[#05102A] rounded-2xl p-6 sm:p-10 shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
        </h1>
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-[#15274D] text-white outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-[#15274D] text-white outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
          <button type="submit" className="bg-amber-400 text-[#05102A] font-bold py-3 rounded-lg hover:bg-amber-300 transition-colors mt-2">
            {isLogin ? "Entrar" : "Registrarse"}
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-400">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-amber-300 hover:underline">
            {isLogin ? "Regístrate aquí" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
