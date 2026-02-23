import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Alimentos() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el carrito y el modal
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCategorias = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "alimentos"));
      const categoriasData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategorias(categoriasData);
    } catch (error) {
      console.error("Error fetching alimentos: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Funciones del carrito
  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    // Si tiene opciones, seleccionar la primera por defecto
    if (item.opciones) {
      const opts = item.opciones.split(",").map(o => o.trim());
      setSelectedOption(opts[0]);
    } else {
      setSelectedOption("");
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const addToCart = () => {
    const newItem = {
      ...selectedItem,
      cartId: Date.now(), // ID único para el carrito
      quantity,
      selectedOption
    };
    setCart([...cart, newItem]);
    closeModal();
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.precio * item.quantity), 0);

  return (
    <section className="px-4 py-6 sm:px-8 sm:py-8 lg:px-10 text-white relative min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold">Alimentos</h1>
        
        {/* Botón flotante del carrito */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="bg-amber-400 text-[#05102A] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-300 transition-colors"
        >
          🛒 Carrito ({cart.length})
        </button>
      </div>
      
      {loading ? (
        <p className="mt-6">Cargando alimentos...</p>
      ) : categorias.length === 0 ? (
        <div className="mt-6 text-center">
          <p className="mb-4">No hay alimentos en la base de datos.</p>
        </div>
      ) : (
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          {categorias.map((categoria) => (
            <article key={categoria.id || categoria.nombre}>
              <h2 className="text-xl font-semibold mb-4">{categoria.nombre}</h2>
              <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:max-w-1/2 lg:max-w-full">
                {categoria.items.map((item) => (
                  <li
                    key={item.nombre}
                    onClick={() => openModal(item)}
                    className="bg-[#05102A] rounded-xl p-4 flex flex-col gap-3 w-full cursor-pointer hover:scale-105 transition-transform border border-transparent hover:border-amber-400"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-40 rounded-lg object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{item.nombre}</span>
                      <span className="text-amber-400 font-bold">${item.precio || 0}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      {/* Modal de Selección de Producto */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#15274D] rounded-2xl p-6 max-w-md w-full flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-amber-400">{selectedItem.nombre}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            
            <img src={selectedItem.imagen} alt={selectedItem.nombre} className="w-full h-48 object-cover rounded-xl" />
            
            <p className="text-xl font-semibold">${selectedItem.precio || 0}</p>

            {/* Opciones (si existen) */}
            {selectedItem.opciones && (
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Selecciona una opción:</label>
                <select 
                  value={selectedOption} 
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="p-3 rounded-lg bg-[#05102A] text-white outline-none focus:ring-2 focus:ring-amber-300"
                >
                  {selectedItem.opciones.split(",").map((opt, idx) => (
                    <option key={idx} value={opt.trim()}>{opt.trim()}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Cantidad */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Cantidad:</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-[#05102A] w-10 h-10 rounded-lg font-bold text-xl hover:bg-gray-700"
                >-</button>
                <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-[#05102A] w-10 h-10 rounded-lg font-bold text-xl hover:bg-gray-700"
                >+</button>
              </div>
            </div>

            <button 
              onClick={addToCart}
              className="w-full bg-amber-400 text-[#05102A] font-bold py-3 rounded-lg mt-4 hover:bg-amber-300 transition-colors"
            >
              Agregar al Carrito - ${(selectedItem.precio || 0) * quantity}
            </button>
          </div>
        </div>
      )}

      {/* Modal del Carrito */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#15274D] rounded-2xl p-6 max-w-lg w-full flex flex-col gap-4 max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
              <h2 className="text-2xl font-bold text-amber-400">Tu Carrito</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto pr-2 flex-1">
              {cart.length === 0 ? (
                <p className="text-center text-gray-400 py-8">El carrito está vacío</p>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} className="bg-[#05102A] p-4 rounded-xl flex gap-4 items-center">
                    <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-bold">{item.nombre}</h3>
                      {item.selectedOption && <p className="text-xs text-gray-400">{item.selectedOption}</p>}
                      <p className="text-sm text-amber-400 font-semibold">${item.precio} x {item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold">${item.precio * item.quantity}</span>
                      <button 
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-xs text-red-500 hover:text-red-400"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-700 pt-4 mt-2">
                <div className="flex justify-between items-center mb-4 text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-amber-400">${cartTotal}</span>
                </div>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/comprar-alimentos", { state: { cart, total: cartTotal } });
                  }}
                  className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-400 transition-colors"
                >
                  Proceder al Pago
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
