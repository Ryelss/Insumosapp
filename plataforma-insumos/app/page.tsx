import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import CatalogoFiltrado from '@/components/CatalogoFiltrado'; // Importamos el nuevo componente

export default async function Home() {
  // Extraemos todos los datos desde Supabase
  const { data: tintas, error } = await supabase.from('tintas').select('*');

  if (error) {
    return <div className="p-10 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Catálogo de Suministros</h2>
          <p className="text-gray-500 mt-1">Seleccione los insumos requeridos para su establecimiento.</p>
        </div>
        
        {/* Aquí insertamos el componente que maneja los filtros y la grilla, pasándole las tintas */}
        <CatalogoFiltrado tintas={tintas || []} />
      </main>
    </div>
  );
}