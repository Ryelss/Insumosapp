"use client";

import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ResumenCarrito({ establecimientos }: { establecimientos: any[] }) {
  const { carrito, removerDelCarrito, limpiarCarrito } = useCartStore();
  const [establecimientoSeleccionado, setEstablecimientoSeleccionado] = useState('');
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!establecimientoSeleccionado) {
      alert("⚠️ Por favor, seleccione un establecimiento.");
      return;
    }
    
    setEnviando(true);

    try {
      // 1. Convertimos el valor del select a NÚMERO para que coincida con el BIGINT de Supabase
      const rbdNumero = Number(establecimientoSeleccionado);

      // 2. VALIDACIÓN ESTRICTA: 1 SOLICITUD SEMANAL
      const haceUnaSemana = new Date();
      haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);
      
      const { data: peticionesPrevias, error: errorCheck } = await supabase
        .from('solicitudes')
        .select('id, fecha')
        .eq('establecimiento_rbd', rbdNumero) // Usamos el número convertido
        .gte('fecha', haceUnaSemana.toISOString());

      if (errorCheck) throw errorCheck;

      // Si encuentra al menos 1 registro en los últimos 7 días, bloquea el proceso
      if (peticionesPrevias && peticionesPrevias.length > 0) {
        alert("🚫 SOLICITUD RECHAZADA: Este establecimiento ya realizó un pedido de insumos en los últimos 7 días. Por favor, espere a la próxima semana.");
        setEnviando(false);
        return; 
      }

      // 3. Crear la Solicitud
      const { data: solicitud, error: errorSolicitud } = await supabase
        .from('solicitudes')
        .insert([{ establecimiento_rbd: rbdNumero }])
        .select()
        .single();

      if (errorSolicitud) throw errorSolicitud;

      // 4. Guardar Detalle
      const detalles = carrito.map((item) => ({
        solicitud_id: solicitud.id,
        tinta_id: item.id,
        cantidad: item.cantidadCarrito
      }));

      const { error: errorDetalles } = await supabase
        .from('detalle_solicitudes')
        .insert(detalles);

      if (errorDetalles) throw errorDetalles;

      // 5. Descontar stock
      for (const item of carrito) {
        const nuevoStock = item.cantidad - item.cantidadCarrito;
        
        const { error: errorStock } = await supabase
          .from('tintas')
          .update({ cantidad: nuevoStock })
          .eq('id', item.id);
          
        if (errorStock) console.error("Error al actualizar stock de:", item.nombre_producto);
      }

      alert("✅ ¡Solicitud ingresada con éxito al departamento TI! El stock ha sido actualizado.");
      limpiarCarrito();
      router.push('/');
      router.refresh();

    } catch (error: any) {
      console.error("Error en el proceso:", error);
      alert("❌ Ocurrió un error: " + error.message);
    } finally {
      setEnviando(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Su carro está vacío</h2>
        <p className="text-gray-500 mb-6">Aún no ha seleccionado ningún insumo de impresión.</p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Insumos Solicitados</h3>
        {carrito.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div>
              <span className="text-xs font-bold text-gray-400 block mb-1">{item.marca} | {item.tipo}</span>
              <p className="font-medium text-gray-800">{item.nombre_producto}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
                {item.cantidadCarrito} un.
              </span>
              <button 
                onClick={() => removerDelCarrito(item.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                disabled={enviando}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 h-fit">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmar Solicitud</h3>
        <form onSubmit={manejarEnvio} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Establecimiento Solicitante
            </label>
            <select
              value={establecimientoSeleccionado}
              onChange={(e) => setEstablecimientoSeleccionado(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
              required
              disabled={enviando}
            >
              <option value="" disabled>-- Seleccione su establecimiento --</option>
              {establecimientos.map((est) => (
                <option key={est.rbd} value={est.rbd}>
                  {est.nombre}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">* Límite de 1 solicitud semanal por establecimiento.</p>
          </div>

          <div className="border-t pt-4">
            <button 
              type="submit"
              disabled={enviando}
              className={`w-full font-bold py-3 rounded-lg transition-all text-white ${
                enviando ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
              }`}
            >
              {enviando ? "Verificando y Procesando..." : "Enviar Solicitud al DAEM"}
            </button>
            <Link href="/" className="block text-center w-full text-blue-600 font-medium py-3 mt-2 hover:bg-blue-50 rounded-lg transition-all">
              Seguir buscando insumos
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}