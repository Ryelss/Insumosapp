import { create } from 'zustand';

// Definimos la estructura de los datos
interface Tinta {
  id: number;
  nombre_producto: string;
  cantidad: number;
}

interface CartItem extends Tinta {
  cantidadCarrito: number;
}

interface CartStore {
  carrito: CartItem[];
  agregarAlCarrito: (tinta: Tinta) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  carrito: [],
  
  agregarAlCarrito: (tinta) => {
    const { carrito } = get();
    
    // Regla de negocio matemática
    const maxPermitido = tinta.cantidad <= 3 ? 1 : 2;
    const itemExistente = carrito.find((item) => item.id === tinta.id);

    if (itemExistente) {
      if (itemExistente.cantidadCarrito >= maxPermitido) {
        alert(`Límite alcanzado: Solo puedes solicitar un máximo de ${maxPermitido} unidad(es) de este insumo.`);
        return;
      }
      set({
        carrito: carrito.map((item) =>
          item.id === tinta.id
            ? { ...item, cantidadCarrito: item.cantidadCarrito + 1 }
            : item
        ),
      });
    } else {
      set({ carrito: [...carrito, { ...tinta, cantidadCarrito: 1 }] });
    }
    alert(`Añadido al carro: ${tinta.nombre_producto}`);
  },
}));