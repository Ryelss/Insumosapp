"use client";

import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import CatalogoFiltrado from './CatalogoFiltrado';
import SidebarCarrito from './SidebarCarrito';

export default function VistaPrincipal({ tintas, establecimientos }: { tintas: any[], establecimientos: any[] }) {
  const establecimiento = useCartStore((state) => state.establecimiento);
  const setSesion = useCartStore((state) => state.setSesion);
  const limpiarCarrito = useCartStore((state) => state.limpiarCarrito);
  
  const [seleccion, setSeleccion] = useState("");
  const [correoInput, setCorreoInput] = useState(""); // Estado para el correo
  const [montado, setMontado] = useState(false);
  
  useEffect(() => setMontado(true), []);

  // TEMPORIZADOR DE INACTIVIDAD
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const reiniciarTemporizador = () => {
      clearTimeout(timeout);
      if (establecimiento) {
        timeout = setTimeout(() => {
          alert("⏳ Sesión cerrada por inactividad. Por seguridad, su selección ha sido cancelada.");
          limpiarCarrito();
          setSesion(null, null); // Cerramos sesión completa
        }, 5 * 60 * 1000); 
      }
    };

    if (establecimiento) {
      reiniciarTemporizador();
      window.addEventListener('mousemove', reiniciarTemporizador);
      window.addEventListener('keydown', reiniciarTemporizador);
      window.addEventListener('click', reiniciarTemporizador);
      window.addEventListener('scroll', reiniciarTemporizador);
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', reiniciarTemporizador);
      window.removeEventListener('keydown', reiniciarTemporizador);
      window.removeEventListener('click', reiniciarTemporizador);
      window.removeEventListener('scroll', reiniciarTemporizador);
    };
  }, [establecimiento, limpiarCarrito, setSesion]);

  const manejarIngreso = (e: React.FormEvent) => {
    e.preventDefault();
    const est = establecimientos.find(e => e.rbd === Number(seleccion));
    
    // Validación de seguridad para asegurar que pongan un correo válido
    if (!correoInput.includes('@')) {
      alert("⚠️ Por favor, ingrese un correo válido.");
      return;
    }

    if (est) {
      setSesion({ rbd: est.rbd, nombre: est.nombre }, correoInput);
    }
  };

  if (!montado) return null;

  if (!establecimiento) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#005EAD]">Bienvenido al DAEM</h2>
          <p className="text-gray-500 mt-2 text-sm">Identifique su establecimiento y su correo institucional para acceder.</p>
        </div>
        <form onSubmit={manejarIngreso} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Establecimiento</label>
            <select 
              value={seleccion}
              onChange={(e) => setSeleccion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005EAD]"
              required
            >
              <option value="" disabled>-- Seleccione su recinto --</option>
              {establecimientos.map(est => (
                <option key={est.rbd} value={est.rbd}>{est.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico (Gmail/Institucional)</label>
            <input 
              type="email"
              placeholder="ejemplo@educasanantonio.cl"
              value={correoInput}
              onChange={(e) => setCorreoInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005EAD]"
              required
            />
          </div>

          <button type="submit" className="w-full mt-2 bg-[#6EAF26] text-white font-bold py-3 rounded-lg hover:bg-[#5c9320] transition-colors shadow-sm">
            Ingresar al Catálogo
          </button>
        </form>
      </div>
    );
  }

  return (
    <main className="max-w-[1600px] w-full mx-auto p-6 md:p-10 flex flex-col lg:flex-row gap-10 xl:gap-14">
      <div className="flex-1 min-w-0">
        <div className="mb-8 pb-4 border-b border-gray-200">
          <h2 className="text-4xl font-extrabold text-[#005EAD] tracking-tight">Catálogo de Suministros</h2>
        </div>
        <CatalogoFiltrado tintas={tintas} />
      </div>
      <aside className="w-full lg:w-[400px] flex-shrink-0">
        <SidebarCarrito />
      </aside>
    </main>
  );
}