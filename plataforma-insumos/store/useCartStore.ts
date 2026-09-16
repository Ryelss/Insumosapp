import { create } from 'zustand';

export interface Tinta {
  id: number;
  nombre_producto: string;
  cantidad: number;
  marca: string;
  tipo: string;
}

export interface CartItem extends Tinta {
  cantidadCarrito: number;
}

export interface Establecimiento {
  rbd: number;
  nombre: string;
}

interface CartStore {
  carrito: CartItem[];
  establecimiento: Establecimiento | null; // Guardará quién está usando el sistema
  agregarAlCarrito: (tinta: Tinta, cantidadAAgregar: number) => void;
  removerDelCarrito: (id: number) => void;
  limpiarCarrito: () => void;
  setEstablecimiento: (est: Establecimiento | null) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  carrito: [],
  establecimiento: null,

  agregarAlCarrito: (tinta, cantidadAAgregar) => set((state) => {
    const existe = state.carrito.find((item) => item.id === tinta.id);
    if (existe) {
      return {
        carrito: state.carrito.map((item) =>
          item.id === tinta.id ? { ...item, cantidadCarrito: item.cantidadCarrito + cantidadAAgregar } : item
        ),
      };
    } else {
      return { carrito: [...state.carrito, { ...tinta, cantidadCarrito: cantidadAAgregar }] };
    }
  }),

  removerDelCarrito: (id) => set((state) => ({
    carrito: state.carrito.filter((item) => item.id !== id)
  })),

  limpiarCarrito: () => set({ carrito: [] }),
  
  // Función para guardar qué colegio se logueó
  setEstablecimiento: (est) => set({ establecimiento: est })
}));