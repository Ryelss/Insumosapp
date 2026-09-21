"use client";

import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function Navbar() {
  const establecimiento = useCartStore((state) => state.establecimiento);
  const usuarioCorreo = useCartStore((state) => state.usuarioCorreo);
  const setSesion = useCartStore((state) => state.setSesion);
  const limpiarCarrito = useCartStore((state) => state.limpiarCarrito); 

  const manejarSalida = () => {
    setSesion(null, null); 
    limpiarCarrito();      
  };

  return (
    <nav className="bg-[#005EAD] text-white p-3 md:p-4 flex flex-col md:flex-row justify-between items-center gap-3 shadow-md sticky top-0 z-50">
      <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
        <h1 className="text-lg md:text-xl font-bold tracking-wide text-center">Plataforma de Insumos DAEM</h1>
      </Link>
      
      {establecimiento && (
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-[#004b8a] px-3 py-1.5 rounded-lg border border-blue-400/30 text-left md:text-right flex-1 min-w-0 overflow-hidden">
            <p className="text-xs md:text-sm font-bold truncate">🏢 {establecimiento.nombre}</p>
            <p className="text-[10px] md:text-xs text-blue-200 truncate">{usuarioCorreo}</p>
          </div>
          <button 
            onClick={manejarSalida}
            className="text-xs md:text-sm bg-red-500 hover:bg-red-600 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors font-bold shadow-sm flex-shrink-0 h-full"
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}