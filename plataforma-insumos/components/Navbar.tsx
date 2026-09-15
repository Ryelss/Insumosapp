"use client";

import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  // Leemos cuántos productos en total hay en el carro
  const carrito = useCartStore((state) => state.carrito);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidadCarrito, 0);

  return (
    <nav className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="bg-white text-blue-900 font-bold p-2 rounded">DAEM</div>
        <h1 className="text-xl font-semibold hidden md:block">Plataforma de Insumos</h1>
      </div>
      
      <div className="bg-blue-800 px-4 py-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-blue-700 transition-colors border border-blue-700">
        <span className="font-medium">🛒 Carro</span>
        <span className="bg-yellow-400 text-blue-900 font-extrabold px-3 py-0.5 rounded-full text-sm">
          {totalItems}
        </span>
      </div>
    </nav>
  );
}