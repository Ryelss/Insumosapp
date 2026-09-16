"use client";

import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function Navbar() {
  const establecimiento = useCartStore((state) => state.establecimiento);
  const usuarioCorreo = useCartStore((state) => state.usuarioCorreo);
  const setSesion = useCartStore((state) => state.setSesion);
  const limpiarCarrito = useCartStore((state) => state.limpiarCarrito); 

  const manejarSalida = () => {
    setSesion(null, null); // Borra escuela y correo
    limpiarCarrito();      // Vacía el carro
  };

  return (
    <nav className="bg-[#005EAD] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
        <h1 className="text-xl font-bold tracking-wide">Plataforma de Insumos DAEM</h1>
      </Link>
      
      {establecimiento && (
        <div className="flex items-center gap-4">
          <div className="bg-[#004b8a] px-3 py-1.5 rounded-lg border border-blue-400/30 text-right">
            <p className="text-sm font-bold">🏢 {establecimiento.nombre}</p>
            <p className="text-xs text-blue-200">{usuarioCorreo}</p>
          </div>
          <button 
            onClick={manejarSalida}
            className="text-sm bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg transition-colors font-bold shadow-sm h-full"
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}