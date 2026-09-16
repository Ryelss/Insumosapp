"use client";

import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function Navbar() {
  const establecimiento = useCartStore((state) => state.establecimiento);
  const setEstablecimiento = useCartStore((state) => state.setEstablecimiento);
  const limpiarCarrito = useCartStore((state) => state.limpiarCarrito); // Traemos la función para vaciar

  const manejarSalida = () => {
    setEstablecimiento(null); // Borra la escuela actual
    limpiarCarrito();         // Vacía el carro por seguridad
  };

  return (
    <nav className="bg-[#005EAD] text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
        <h1 className="text-xl font-bold tracking-wide">Plataforma de Insumos DAEM</h1>
      </Link>
      
      {/* Indicador del colegio logueado */}
      {establecimiento && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium bg-[#004b8a] px-3 py-1.5 rounded-lg border border-blue-400/30">
            🏢 {establecimiento.nombre}
          </span>
          <button 
            onClick={manejarSalida}
            className="text-sm bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg transition-colors font-bold shadow-sm"
          >
            Salir
          </button>
        </div>
      )}
    </nav>
  );
}