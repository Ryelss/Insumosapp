import { create } from 'zustand';

// 1. Definimos cómo es exactamente una Tinta que viene de tu base de datos
export interface Tinta {
  id: number;
  nombre_producto: string;
  cantidad: number;
  marca: string;
  tipo: string;
}

// 2. Definimos cómo es un ítem dentro del carro (es una Tinta + la cantidad que el usuario pidió)
export interface CartItem extends Tinta {
  cantidadCarrito: number;
}

// 3. Definimos todas las funciones y variables que tendrá nuestro "Cerebro" (Store)
interface CartStore {
  carrito: CartItem[];
  agregarAlCarrito: (tinta: Tinta) => void;
  removerDelCarrito: (id: number) => void;
  limpiarCarrito: () => void;
}

// 4. Creamos el Store con Zustand
export const useCartStore = create<CartStore>((set) => ({
  // Estado inicial: El carro empieza vacío
  carrito: [],

  // Función para AGREGAR o sumar cantidad
  agregarAlCarrito: (tinta) => set((state) => {
    // Buscamos si la tinta ya está en el carro
    const existe = state.carrito.find((item) => item.id === tinta.id);
    
    if (existe) {
      // Si ya existe, validamos que no estemos pidiendo más del stock real que hay
      if (existe.cantidadCarrito >= tinta.cantidad) {
        return state; // No hacemos cambios si llegamos al tope
      }
      // Sumamos 1 a la cantidad del carro
      return {
        carrito: state.carrito.map((item) =>
          item.id === tinta.id
            ? { ...item, cantidadCarrito: item.cantidadCarrito + 1 }
            : item
        ),
      };
    } else {
      // Si no existe y hay stock, lo agregamos como nuevo ítem empezando con 1
      if (tinta.cantidad > 0) {
        return {
          carrito: [...state.carrito, { ...tinta, cantidadCarrito: 1 }],
        };
      }
      return state; // Si el stock es 0, no hace nada
    }
  }),

  // NUEVA Función para ELIMINAR un ítem completo del carro
  removerDelCarrito: (id) => set((state) => ({
    // Filtramos el arreglo dejando pasar a todos MENOS al que tenga el ID que queremos borrar
    carrito: state.carrito.filter((item) => item.id !== id)
  })),

  // NUEVA Función para VACIAR completamente el carro (al enviar el pedido o cancelar)
  limpiarCarrito: () => set({ 
    carrito: [] 
  })
}));