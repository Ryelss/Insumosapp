"use client";

import { useCartStore } from '@/store/useCartStore';

export default function TarjetaProducto({ tinta }: { tinta: any }) {
  const { carrito, agregarAlCarrito } = useCartStore();
  
  // Buscamos si esta tinta específica ya está en el carro para saber cuánto descontar
  const itemEnCarro = carrito.find((item) => item.id === tinta.id);
  const cantidadEnCarro = itemEnCarro ? itemEnCarro.cantidadCarrito : 0;
  
  // Matemáticas en tiempo real: Stock original - lo que ya metí al carro
  const stockDisponible = tinta.cantidad - cantidadEnCarro;

  return (
    <div className="border border-gray-200 p-5 rounded-xl shadow-sm bg-white hover:shadow-lg transition-shadow flex flex-col justify-between h-full">
      <div>
        {/* Etiqueta de marca estilo PC Factory */}
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
          {tinta.nombre_producto.includes('BROTHER') ? 'BROTHER' : 
           tinta.nombre_producto.includes('CANON') ? 'CANON' : 'GENÉRICO'}
        </span>
        <h2 className="font-semibold text-gray-800 leading-tight mb-4">
          {tinta.nombre_producto}
        </h2>
        
        <div className="flex justify-between items-end mb-4">
          <p className="text-sm text-gray-500">
            Stock actual:<br/>
            <span className="font-black text-2xl text-blue-600">{stockDisponible}</span> un.
          </p>
          {cantidadEnCarro > 0 && (
            <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">
              Llevas {cantidadEnCarro}
            </span>
          )}
        </div>
      </div>

      <button 
        onClick={() => agregarAlCarrito(tinta)}
        disabled={stockDisponible === 0} // Apagamos el botón si llega a cero
        className={`mt-2 px-4 py-3 rounded-lg w-full font-bold transition-all ${
          stockDisponible === 0 
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
        }`}
      >
        {stockDisponible === 0 ? "Agotado" : "Añadir al Carro"}
      </button>
    </div>
  );
}