"use client";

import { useState } from 'react';
import TarjetaProducto from './TarjetaProducto';

export default function CatalogoFiltrado({ tintas }: { tintas: any[] }) {
  const [marcaFiltro, setMarcaFiltro] = useState('Todas');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');

  // 1. OBTENER MARCAS ÚNICAS (Siempre de la base de datos completa)
  const marcasUnicas = [
    'Todas', 
    ...Array.from(
      new Set(
        tintas.map(t => (t.marca || '').trim().toUpperCase()).filter(Boolean)
      )
    )
  ];

  // 2. PRE-FILTRO POR MARCA: Separamos solo los insumos de la marca seleccionada
  const tintasFiltradasPorMarca = tintas.filter((tinta) => {
    const marcaTinta = (tinta.marca || '').trim().toUpperCase();
    return marcaFiltro === 'Todas' || marcaTinta === marcaFiltro;
  });

  // 3. TIPOS DINÁMICOS: Buscamos los tipos disponibles SOLO dentro de la marca seleccionada
  const tiposUnicos = [
    'Todos', 
    ...Array.from(
      new Set(
        tintasFiltradasPorMarca.map(t => (t.tipo || '').trim().toUpperCase()).filter(Boolean)
      )
    )
  ];

  // 4. FILTRO FINAL: A la lista de la marca, le aplicamos el filtro del tipo seleccionado
  const tintasFiltradas = tintasFiltradasPorMarca.filter((tinta) => {
    const tipoTinta = (tinta.tipo || '').trim().toUpperCase();
    return tipoFiltro === 'Todos' || tipoTinta === tipoFiltro;
  });

  return (
    <div>
      {/* MENÚ HORIZONTAL DE FILTROS */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <span className="font-semibold text-gray-700 flex-shrink-0">Filtrar catálogo:</span>
        
        {/* Selector Dinámico de Marca */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="marca" className="text-sm text-gray-500">Marca:</label>
          <select 
            id="marca"
            value={marcaFiltro}
            onChange={(e) => {
              setMarcaFiltro(e.target.value);
              // TRUCO UX: Reiniciar el tipo a "Todos" al cambiar de marca
              setTipoFiltro('Todos'); 
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer"
          >
            {marcasUnicas.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Selector Dinámico de Tipo (Ahora es dependiente de la marca) */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="tipo" className="text-sm text-gray-500">Tipo:</label>
          <select 
            id="tipo"
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none cursor-pointer"
          >
            {tiposUnicos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Indicador de resultados */}
        <div className="sm:ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          Mostrando <strong>{tintasFiltradas.length}</strong> insumo(s)
        </div>
      </div>

      {/* GRILLA DE PRODUCTOS */}
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