import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import VistaPrincipal from '@/components/VistaPrincipal';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Traemos ambos datos directamente en el servidor
  const { data: tintas } = await supabase.from('tintas').select('*').order('nombre_producto', { ascending: true });
  const { data: establecimientos } = await supabase.from('establecimientos').select('*').order('nombre', { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <VistaPrincipal 
        tintas={tintas || []} 
        establecimientos={establecimientos || []} 
      />
    </div>
  );
}