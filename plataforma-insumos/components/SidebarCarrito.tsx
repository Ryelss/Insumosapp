"use client";

import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SidebarCarrito() {
  const { carrito, removerDelCarrito, limpiarCarrito, establecimiento } = useCartStore();
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidadCarrito, 0);

  const manejarEnvio = async () => {
    if (!establecimiento || carrito.length === 0) return;
    if (totalItems > 25) {
      alert("⚠️ Ha superado el límite de 25 insumos por pedido.");
      return;
    }

    setEnviando(true);

    try {
      const haceUnaSemana = new Date();
      haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);
      
      const { data: peticionesPrevias, error: errorCheck } = await supabase
        .from('solicitudes')
        .select('id, fecha')
        .eq('establecimiento_rbd', establecimiento.rbd)
        .gte('fecha', haceUnaSemana.toISOString());

      if (errorCheck) throw errorCheck;

      if (peticionesPrevias && peticionesPrevias.length > 0) {
        alert("🚫 RECHAZADO: El establecimiento ya solicitó insumos en los últimos 7 días.");
        setEnviando(false);
        return; 
      }

      const { data: solicitud, error: errorSolicitud } = await supabase
        .from('solicitudes')
        .insert([{ establecimiento_rbd: establecimiento.rbd }])
        .select()
        .single();
      if (errorSolicitud) throw errorSolicitud;

      const detalles = carrito.map(item => ({ solicitud_id: solicitud.id, tinta_id: item.id, cantidad: item.cantidadCarrito }));
      const { error: errorDetalles } = await supabase.from('detalle_solicitudes').insert(detalles);
      if (errorDetalles) throw errorDetalles;

      for (const item of carrito) {
        const nuevoStock = item.cantidad - item.cantidadCarrito;
        await supabase.from('tintas').update({ cantidad: nuevoStock }).eq('id', item.id);
      }

      const usuarioCorreo = useCartStore.getState().usuarioCorreo;

      await fetch('/api/enviar-correo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          establecimiento: establecimiento.nombre,
          correoSolicitante: usuarioCorreo,
          detalles: carrito
        })
      });

      alert("✅ ¡Solicitud ingresada con éxito! El stock ha sido actualizado y se ha notificado a Administración.");
      limpiarCarrito();
      router.refresh(); 

    } catch (error: any) {
      console.error(error);
      alert("❌ Error: " + error.message);
    } finally {
      setEnviando(false);
    }
  };

  // CAMBIO AQUÍ: Quitamos hidden lg:block y ponemos lg:sticky
  if (carrito.length === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 text-center lg:sticky lg:top-24 mb-10 lg:mb-0">
        <span className="text-3xl block mb-2 opacity-50">🛒</span>
        <p className="text-sm font-medium text-gray-500">Agregue insumos para solicitar</p>
      </div>
    );
  }

  // CAMBIO AQUÍ: Quitamos hidden lg:block, ajustamos sticky y márgenes
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 lg:sticky lg:top-24 mb-10 lg:mb-0">
      
      <div className="bg-orange-50 border-l-4 border-[#F09B1A] p-3 mb-5 rounded-r text-sm text-orange-900 shadow-sm">
        <strong>⚠️ Políticas de Pedido:</strong>
        <ul className="list-disc ml-5 mt-1">
          <li>Máximo <strong>1 solicitud</strong> por semana.</li>
          <li>Límite de <strong>25 insumos</strong> por pedido.</li>
        </ul>
      </div>

      <h3 className="text-base font-bold text-[#005EAD] mb-4 border-b pb-2 flex justify-between items-center">
        <span>Resumen del Pedido</span>
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={limpiarCarrito} className="text-xs text-red-500 hover:text-red-700 font-bold underline transition-colors">
            Vaciar Todo
          </button>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${totalItems === 25 ? 'bg-red-500' : 'bg-[#F09B1A]'}`}>
            {totalItems}/25 ítems
          </span>
        </div>
      </h3>
      
      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
        {carrito.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
            <div className="flex-1 pr-3">
              <p className="font-semibold text-gray-800 line-clamp-2 leading-tight mb-1">{item.nombre_producto}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold bg-gray-100 px-2 py-1 rounded">x{item.cantidadCarrito}</span>
              <button onClick={() => removerDelCarrito(item.id)} className="text-red-400 font-bold hover:text-red-600 p-1">✕</button>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={manejarEnvio}
        disabled={enviando}
        className={`mt-5 w-full font-bold py-3 rounded-lg shadow-md transition-all text-white ${
          enviando ? "bg-gray-400 cursor-not-allowed" : "bg-[#6EAF26] hover:bg-[#5c9320]"
        }`}
      >
        {enviando ? "Procesando y Notificando..." : "Enviar Solicitud"}
      </button>
    </div>
  );
}