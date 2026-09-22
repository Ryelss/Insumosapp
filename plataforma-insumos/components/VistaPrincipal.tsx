"use client";

import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect, useRef } from 'react';
import CatalogoFiltrado from './CatalogoFiltrado';
import SidebarCarrito from './SidebarCarrito';

export default function VistaPrincipal({ tintas, establecimientos }: { tintas: any[], establecimientos: any[] }) {
  const establecimiento = useCartStore((state) => state.establecimiento);
  const setSesion = useCartStore((state) => state.setSesion);
  const limpiarCarrito = useCartStore((state) => state.limpiarCarrito);
  
  const [seleccion, setSeleccion] = useState("");
  const [correoInput, setCorreoInput] = useState("");
  const [montado, setMontado] = useState(false);
  
  // NUEVO: Estados para el temporizador visual
  const [tiempoRestante, setTiempoRestante] = useState(300); // 300 segundos = 5 minutos
  const ultimaActividad = useRef<number>(0);

  useEffect(() => setMontado(true), []);

  // TEMPORIZADOR VISUAL E INACTIVIDAD
  useEffect(() => {
    if (!establecimiento) return;

    const TIEMPO_LIMITE = 300; // 5 minutos
    ultimaActividad.current = Date.now();
    setTiempoRestante(TIEMPO_LIMITE);

    // Registra la actividad de forma silenciosa para no saturar la pantalla
    const registrarActividad = () => {
      ultimaActividad.current = Date.now();
    };

    // Eventos que reinician el reloj
    window.addEventListener('mousemove', registrarActividad);
    window.addEventListener('keydown', registrarActividad);
    window.addEventListener('click', registrarActividad);
    window.addEventListener('scroll', registrarActividad);

    // Un reloj que revisa cada 1 segundo cuánto tiempo ha pasado
    const intervalo = setInterval(() => {
      const ahora = Date.now();
      const segundosPasados = Math.floor((ahora - ultimaActividad.current) / 1000);
      const restante = TIEMPO_LIMITE - segundosPasados;

      if (restante <= 0) {
        clearInterval(intervalo);
        alert("⏳ Sesión cerrada por inactividad. Por seguridad, su selección ha sido cancelada.");
        limpiarCarrito();
        setSesion(null, null);
      } else {
        setTiempoRestante(restante);
      }
    }, 1000);

    return () => {
      clearInterval(intervalo);
      window.removeEventListener('mousemove', registrarActividad);
      window.removeEventListener('keydown', registrarActividad);
      window.removeEventListener('click', registrarActividad);
      window.removeEventListener('scroll', registrarActividad);
    };
  }, [establecimiento, limpiarCarrito, setSesion]);

  const manejarIngreso = (e: React.FormEvent) => {
    e.preventDefault();
    const est = establecimientos.find(e => e.rbd === Number(seleccion));
    
    if (!correoInput.includes('@')) {
      alert("⚠️ Por favor, ingrese un correo válido.");
      return;
    }

    if (est) {
      setSesion({ rbd: est.rbd, nombre: est.nombre }, correoInput);
    }
  };

  // Cálculos matemáticos para mostrar el tiempo en formato MM:SS
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  const tiempoFormateado = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

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
    <main className="max-w-[1600px] w-full mx-auto p-4 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-8 xl:gap-14">
      <div className="flex-1 min-w-0">
        
        {/* ENCABEZADO CON CONTADOR INCORPORADO */}
        <div className="mb-8 pb-4 border-b border-gray-200 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#005EAD] tracking-tight">Catálogo de Suministros</h2>
          </div>
          
          {/* EL CONTADOR VISUAL */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-all duration-300 ${
            tiempoRestante <= 60 
              ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse' // Rojo parpadeante al último minuto
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            <span>⏳ Expira en:</span>
            <span className="text-lg tabular-nums">{tiempoFormateado}</span>
          </div>
        </div>

        <CatalogoFiltrado tintas={tintas} />
      </div>
      
      <aside className="w-full lg:w-[400px] flex-shrink-0">
        <SidebarCarrito />
      </aside>
    </main>
  );
}