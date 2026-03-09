import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function DashboardAlimentos() {
  const [alimentos, setAlimentos] = useState([]);
  const [loadingAlimentos, setLoadingAlimentos] = useState(false);
  const [editingAlimento, setEditingAlimento] = useState(null);
  const [alimentoForm, setAlimentoForm] = useState({
    nombre: "",
    items: []
  });

  useEffect(() => {
    fetchAlimentos();
  }, []);

  const fetchAlimentos = async () => {
    setLoadingAlimentos(true);
    try {
      const querySnapshot = await getDocs(collection(db, "alimentos"));
      const alimentosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlimentos(alimentosData);
    } catch (error) {
      console.error("Error fetching alimentos: ", error);
    } finally {
      setLoadingAlimentos(false);
    }
  };

  const handleAlimentoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAlimento) {
        const alimentoRef = doc(db, "alimentos", editingAlimento.id);
        await updateDoc(alimentoRef, alimentoForm);
        alert("Categoría de alimentos actualizada");
      } else {
        await addDoc(collection(db, "alimentos"), alimentoForm);
        alert("Categoría de alimentos agregada");
      }
      setEditingAlimento(null);
      setAlimentoForm({ nombre: "", items: [] });
      fetchAlimentos();
    } catch (error) {
      console.error("Error saving alimento: ", error);
      alert("Error al guardar la categoría de alimentos");
    }
  };

  const handleEditAlimentoClick = (alimento) => {
    setEditingAlimento(alimento);
    setAlimentoForm({
      nombre: alimento.nombre,
      items: alimento.items || []
    });
  };

  const handleDeleteAlimento = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría de alimentos?")) {
      try {
        await deleteDoc(doc(db, "alimentos", id));
        alert("Categoría eliminada");
        fetchAlimentos();
      } catch (error) {
        console.error("Error deleting alimento: ", error);
        alert("Error al eliminar la categoría");
      }
    }
  };

  const handleAddItem = () => {
    setAlimentoForm({
      ...alimentoForm,
      items: [...alimentoForm.items, { nombre: "", imagen: "", precio: 0, opciones: "" }]
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...alimentoForm.items];
    newItems[index][field] = value;
    setAlimentoForm({ ...alimentoForm, items: newItems });
  };

  const handleRemoveItem = (index) => {
    const newItems = alimentoForm.items.filter((_, i) => i !== index);
    setAlimentoForm({ ...alimentoForm, items: newItems });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Formulario de Alimentos */}
      <div className="w-full lg:w-1/3 bg-[#15274D] p-6 rounded-xl h-fit">
        <h2 className="text-xl font-semibold mb-4">
          {editingAlimento ? "Editar Categoría" : "Agregar Categoría"}
        </h2>
        <form onSubmit={handleAlimentoSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre de la Categoría (ej. Combos, Bebidas)"
            value={alimentoForm.nombre}
            onChange={(e) => setAlimentoForm({...alimentoForm, nombre: e.target.value})}
            className="p-3 rounded-lg bg-[#05102A] text-white outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
          
          <div className="border-t border-gray-600 pt-4 mt-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Items de la Categoría</h3>
              <button 
                type="button" 
                onClick={handleAddItem}
                className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1 rounded transition-colors"
              >
                + Agregar Item
              </button>
            </div>
            
            <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {alimentoForm.items.map((item, index) => (
                <div key={index} className="bg-[#05102A] p-3 rounded-lg border border-gray-700 relative">
                  <button 
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-400 font-bold"
                  >
                    X
                  </button>
                  <input
                    type="text"
                    placeholder="Nombre del item"
                    value={item.nombre}
                    onChange={(e) => handleItemChange(index, 'nombre', e.target.value)}
                    className="w-full p-2 mb-2 rounded bg-[#15274D] text-white outline-none text-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={item.precio || ""}
                    onChange={(e) => handleItemChange(index, 'precio', Number(e.target.value))}
                    className="w-full p-2 mb-2 rounded bg-[#15274D] text-white outline-none text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Opciones (ej: Coca, Fanta, Sprite)"
                    value={item.opciones || ""}
                    onChange={(e) => handleItemChange(index, 'opciones', e.target.value)}
                    className="w-full p-2 mb-2 rounded bg-[#15274D] text-white outline-none text-sm"
                  />
                  <input
                    type="url"
                    placeholder="URL de la imagen"
                    value={item.imagen}
                    onChange={(e) => handleItemChange(index, 'imagen', e.target.value)}
                    className="w-full p-2 rounded bg-[#15274D] text-white outline-none text-sm"
                    required
                  />
                </div>
              ))}
              {alimentoForm.items.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">No hay items en esta categoría</p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="flex-1 bg-amber-400 text-[#05102A] font-bold py-3 rounded-lg hover:bg-amber-300 transition-colors">
              {editingAlimento ? "Actualizar" : "Guardar"}
            </button>
            {editingAlimento && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingAlimento(null);
                  setAlimentoForm({ nombre: "", items: [] });
                }}
                className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Alimentos */}
      <div className="w-full lg:w-2/3">
        <h2 className="text-xl font-semibold mb-4">Categorías en Base de Datos</h2>
        {loadingAlimentos ? (
          <p>Cargando alimentos...</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {alimentos.map(alimento => (
              <div key={alimento.id} className="bg-[#15274D] p-4 rounded-xl flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                  <h3 className="font-bold text-amber-300 text-lg">{alimento.nombre}</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditAlimentoClick(alimento)}
                      className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition-colors"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteAlimento(alimento.id)}
                      className="text-xs bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {alimento.items && alimento.items.map((item, idx) => (
                    <div key={idx} className="bg-[#05102A] px-3 py-2 rounded-lg text-sm flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <img src={item.imagen} alt={item.nombre} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold">{item.nombre}</span>
                        <span className="text-green-400">${item.precio}</span>
                      </div>
                      {item.opciones && (
                        <span className="text-xs text-gray-400">Opciones: {item.opciones}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
