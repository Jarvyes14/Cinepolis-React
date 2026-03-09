import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function DashboardUsuarios() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users: ", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="bg-[#15274D] p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Usuarios Registrados</h2>
      {loadingUsers ? (
        <p>Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400">No hay usuarios registrados o no se han guardado en la colección 'users'.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-600 text-amber-300">
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Membresía</th>
                <th className="py-3 px-4">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-700 hover:bg-[#1e3a8a] transition-colors">
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-amber-400 text-[#05102A]' : 'bg-gray-600 text-white'}`}>
                      {u.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {u.membership ? (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500 text-white">
                        {u.level} ({u.points} pts)
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">Sin membresía</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Desconocida'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
