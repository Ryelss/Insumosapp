"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminPage() {
  const [autenticado, setAutenticado] = useState(false);
  const [password, setPassword] = useState('');
  const [tintas, setTintas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  // CLAVE MAESTRA DE BODEGA (Puedes cambiarla por la que prefieras)
  const CLAVE_SECRETA = "Casa289328*"; 

  const cargarInventario = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('tintas')
      .select('*')
      .order('nombre_producto', { ascending: true });
    
    if (!error && data) setTintas(data);
    setCargando(false);
  };

  useEffect(() => {
    if (autenticado) {
      cargarInventario();
    }
  }, [autenticado]);

  const manejarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CLAVE_SECRETA) {
      setAutenticado(true);
    } else {
      alert("❌ Contraseña incorrecta");
    }
  };

  // Función para SUMAR stock a un producto específico
  const sumarStock = async (id: number, stockActual: number, cantidadASumar: string) => {
    const cantidadNumerica = parseInt(cantidadASumar);
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) return;

    const nuevoStock = stockActual + cantidadNumerica;

    const { error } = await supabase
      .from('tintas')
      .update({ cantidad: nuevoStock })
      .eq('id', id);

    if (error) {
      alert("Error actualizando stock: " + error.message);
    } else {
      alert(`✅ Stock actualizado. Nuevo total: ${nuevoStock}`);
      cargarInventario(); // Recarga la tabla para mostrar el nuevo número
    }
  };

  // PANTALLA DE LOGIN
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-[#005EAD] mb-2">Acceso a Bodega</h2>
          <p className="text-sm text-gray-500 mb-6">Panel exclusivo para gestión de inventario</p>
          <form onSubmit={manejarLogin} className="space-y-4">
            <input 
              type="password"
              placeholder="Ingrese clave de acceso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#005EAD]"
            />
            <button type="submit" className="w-full bg-[#005EAD] text-white font-bold py-3 rounded-lg hover:bg-[#004b8a] transition-colors">
              Ingresar
            </button>
            <Link href="/" className="block mt-4 text-sm text-gray-400 hover:text-gray-600">
              Volver al catálogo
            </Link>
          </form>
        </div>
      </div>
    );
  }

  // PANTALLA DEL PANEL DE ADMINISTRACIÓN
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-[#005EAD]">Gestión de Stock</h1>
            <p className="text-gray-500 mt-1">Añada unidades a los insumos ingresados a bodega.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition">
              Ver Catálogo
            </Link>
            <button 
              onClick={() => setAutenticado(false)}
              className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {cargando ? (
          <p className="text-center text-gray-500">Cargando inventario...</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#005EAD] text-white">
                  <th className="p-4 font-semibold text-sm">ID</th>
                  <th className="p-4 font-semibold text-sm">Insumo</th>
                  <th className="p-4 font-semibold text-sm">Stock Actual</th>
                  <th className="p-4 font-semibold text-sm">Añadir Unidades (Reposición)</th>
                </tr>
              </thead>
              <tbody>
                {tintas.map((tinta) => (
                  <tr key={tinta.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-400 font-bold">#{tinta.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{tinta.nombre_producto}</p>
                      <p className="text-xs text-gray-500 uppercase">{tinta.marca} | {tinta.tipo}</p>
                    </td>
                    <td className="p-4">
                      <span className={`text-xl font-black ${tinta.cantidad === 0 ? 'text-red-500' : 'text-[#6EAF26]'}`}>
                        {tinta.cantidad}
                      </span>
                    </td>
                    <td className="p-4">
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const input = (e.target as HTMLFormElement).elements.namedItem('cantidad') as HTMLInputElement;
                          sumarStock(tinta.id, tinta.cantidad, input.value);
                          input.value = ''; // Limpia el input después de enviar
                        }}
                        className="flex gap-2"
                      >
                        <input 
                          name="cantidad"
                          type="number" 
                          min="1"
                          placeholder="+0"
                          className="w-20 p-2 border border-gray-300 rounded-lg outline-none focus:border-[#005EAD] text-center"
                          required
                        />
                        <button 
                          type="submit"
                          className="bg-[#6EAF26] hover:bg-[#5c9320] text-white px-4 py-2 rounded-lg font-bold transition-colors"
                        >
                          Sumar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}