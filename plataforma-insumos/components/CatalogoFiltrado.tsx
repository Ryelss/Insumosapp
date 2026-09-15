"use client";

import { useState } from 'react';
import TarjetaProducto from './TarjetaProducto';

export default function CatalogoFiltrado({ tintas }: { tintas: any[] }) {
  // Variables de memoria (estado) para saber qué seleccionó el usuario
  const [marcaFiltro, setMarcaFiltro] = useState('Todas');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');

  // Opciones disponibles para los menús
  const marcas = ['Todas', 'Brother', 'Canon'];
  const tipos = ['Todos', 'Tinta', 'Tóner', 'Tambor', 'Cartucho'];

  // Lógica de filtrado instantáneo
  const tintasFiltradas = tintas.filter((tinta) => {
    const nombre = tinta.nombre_producto.toUpperCase();
    
    // Validar la marca
    const cumpleMarca = marcaFiltro === 'Todas' || nombre.includes(marcaFiltro.toUpperCase());
    
    // Validar el tipo (convertimos 'Tóner' a 'TONER' para que coincida con tu base de datos)
    let cumpleTipo = true;
    if (tipoFiltro !== 'Todos') {
      if (tipoFiltro === 'Tinta') cumpleTipo = nombre.includes('TINTA');
      if (tipoFiltro === 'Tóner') cumpleTipo = nombre.includes('TONER');
      if (tipoFiltro === 'Tambor') cumpleTipo = nombre.includes('TAMBOR');
      if (tipoFiltro === 'Cartucho') cumpleTipo = nombre.includes('CARTUCHO');
    }

    return cumpleMarca && cumpleTipo;
  });

  return (
    <div>
      {/* MENÚ HORIZONTAL DE FILTROS */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <span className="font-semibold text-gray-700 flex-shrink-0">Filtrar catálogo:</span>
        
        {/* Selector de Marca */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="marca" className="text-sm text-gray-500">Marca:</label>
          <select 
            id="marca"
            value={marcaFiltro}
            onChange={(e) => setMarcaFiltro(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer"
          >
            {marcas.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Selector de Tipo de Insumo */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="tipo" className="text-sm text-gray-500">Tipo:</label>
          <select 
            id="tipo"
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer"
          >
            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Indicador de resultados */}
        <div className="sm:ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          Mostrando <strong>{tintasFiltradas.length}</strong> insumo(s)
        </div>
      </div>

      {/* GRILLA DE PRODUCTOS (Reacciona a los filtros) */}
      {tintasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tintasFiltradas.map((tinta) => (
            <TarjetaProducto key={tinta.id} tinta={tinta} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No se encontraron insumos con esos filtros.</p>
          <button 
            onClick={() => { setMarcaFiltro('Todas'); setTipoFiltro('Todos'); }}
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}
    </div>
  );
}