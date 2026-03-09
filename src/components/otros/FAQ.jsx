import { useState } from "react";

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "¿Puedo cancelar mis boletos?", a: "Sí, puedes cancelar tus boletos hasta 1 hora antes de la función directamente desde tu perfil." },
    { q: "¿Qué pasa si pierdo mi código QR?", a: "No te preocupes, tu código QR siempre estará disponible en la sección 'Mis Entradas' dentro de tu perfil de usuario." },
    { q: "¿Aceptan mascotas?", a: "Solo en funciones especiales marcadas como 'Pet Friendly' en la cartelera. En funciones regulares no está permitido." },
    { q: "¿Cómo acumulo puntos en mi membresía?", a: "Por cada $10 pesos de compra en boletos o dulcería, acumulas 1 punto CineFan." }
  ];

  return (
    <div className="bg-[#05102A] rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-[#15274D] rounded-xl overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full text-left p-4 font-semibold flex justify-between items-center hover:bg-[#1e3a8a] transition-colors"
            >
              <span>{faq.q}</span>
              <span className="text-amber-400 text-xl font-bold">
                {openFaq === index ? "−" : "+"}
              </span>
            </button>
            <div 
              className={`px-4 text-gray-300 text-sm transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"}`}
            >
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
