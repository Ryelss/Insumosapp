"use client";

import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';

export default function TarjetaProducto({ tinta }: { tinta: any }) {
  const { carrito, agregarAlCarrito } = useCartStore();
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(0);
  
  const itemEnCarro = carrito.find((item) => item.id === tinta.id);
  const cantidadEnCarro = itemEnCarro ? itemEnCarro.cantidadCarrito : 0;
  
  // NUEVO: Calculamos cuántos ítems llevan en total en el carro
  const totalEnCarro = carrito.reduce((acc, item) => acc + item.cantidadCarrito, 0);
  
  let limitePorRegla = 3; 
  if (tinta.cantidad <= 3) {
    limitePorRegla = 1;
  } else if (tinta.cantidad <= 10) {
    limitePorRegla = 2;
  }
  
  // Modificamos la matemática: El límite ahora también considera el máximo global de 25
  const disponibleParaAgregar = Math.min(
    limitePorRegla - cantidadEnCarro, 
    tinta.cantidad - cantidadEnCarro,
    25 - totalEnCarro // Freno global
  );

  const manejarAgregar = () => {
    if (cantidadSeleccionada === 0) {
      alert("⚠️ Debe seleccionar una cantidad mayor a 0 para añadir este insumo al pedido.");
      return; 
    }
    agregarAlCarrito(tinta, cantidadSeleccionada);
    setCantidadSeleccionada(0); 
  };

  return (
    <div className="border border-gray-200 p-5 rounded-xl shadow-sm bg-white hover:shadow-lg transition-shadow flex flex-col justify-between h-full">
      <div>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
          {tinta.marca || 'GENÉRICO'}
        </span>
        <h2 className="font-semibold text-gray-800 leading-tight mb-4">
          {tinta.nombre_producto}
        </h2>
        
        <div className="flex justify-between items-end mb-4">
          <p className="text-sm text-gray-500">
            Stock en bodega:<br/>
            <span className="font-black text-2xl text-[#005EAD]">{tinta.cantidad}</span> un.
          </p>
          {cantidadEnCarro > 0 && (
            <span className="text-xs font-bold bg-[#6EAF26]/20 text-[#6EAF26] px-2 py-1 rounded">
              Llevas {cantidadEnCarro} (Máx {limitePorRegla})
            </span>
          )}
        </div>
      </div>

      {disponibleParaAgregar > 0 ? (
        <div className="mt-2 flex gap-2">
          <select 
            value={cantidadSeleccionada}
            onChange={(e) => setCantidadSeleccionada(Number(e.target.value))}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-bold rounded-lg focus:ring-[#005EAD] focus:border-[#005EAD] block w-20 p-2.5 outline-none cursor-pointer"
          >
            <option value={0}>0</option>
            {Array.from({ length: disponibleParaAgregar }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          
          <button 
            onClick={manejarAgregar}
            className="bg-[#005EAD] text-white px-4 py-2.5 rounded-lg w-full font-bold hover:bg-[#004b8a] shadow-sm hover:shadow-md transition-all"
          >
            Añadir
          </button>
        </div>
      ) : (
        <button 
          disabled
          className={`mt-2 px-4 py-3 rounded-lg w-full font-bold text-white cursor-not-allowed shadow-inner transition-colors ${
            tinta.cantidad === 0 ? "bg-red-600" : "bg-gray-400"
          }`}
        >
          {tinta.cantidad === 0 ? "Agotado" : totalEnCarro >= 25 ? "Límite de 25 alcanzado" : "Límite alcanzado"}
        </button>
      )}
    </div>
  );
}