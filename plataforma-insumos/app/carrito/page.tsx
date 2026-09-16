import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import ResumenCarrito from '@/components/ResumenCarrito';

// Evita que Next.js guarde esta página en caché por si creas nuevos colegios
export const dynamic = 'force-dynamic';

export default async function CarritoPage() {
  // Extraemos todos los establecimientos y los ordenamos alfabéticamente
  const { data: establecimientos, error } = await supabase
    .from('establecimientos')
    .select('*')
    .order('nombre', { ascending: true }); // Cambia 'nombre' si tu columna se llama distinto

  if (error) {
    return <div className="p-10 text-red-500">Error cargando establecimientos: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="mb-8 pb-4">
          <h2 className="text-3xl font-bold text-gray-800">Resumen de su Pedido</h2>
          <p className="text-gray-500 mt-2">Revise las cantidades y seleccione su establecimiento para procesar la entrega.</p>
        </div>
        
        <ResumenCarrito establecimientos={establecimientos || []} />
      </main>
    </div>
  );
}