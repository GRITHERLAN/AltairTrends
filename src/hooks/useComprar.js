// ============================================================
// useComprar.js
// Lógica del botón "Comprar" (la comparten la tarjeta y la página del producto):
//   1) registra la compra para las estadísticas (sin tocar el stock),
//   2) avisa visualmente,
//   3) abre el enlace de compra configurado por el administrador.
// ============================================================

import { useAvisos } from '../context/AvisosContext';
import { useProductos } from '../context/ProductosContext';

export function useComprar() {
  const { comprar } = useProductos();
  const { mostrarAviso } = useAvisos();

  return function manejarCompra(evento, producto) {
    // Evita cualquier comportamiento por defecto del botón/enlace.
    evento.preventDefault();

    const resultado = comprar(producto.id);
    if (!resultado.ok) {
      mostrarAviso('error', resultado.error);
      return;
    }

    mostrarAviso('exito', `Compra registrada: "${producto.nombre}". Te llevamos al enlace de compra.`);
    // Se abre en otra pestaña, sin darle acceso a esta ventana (noopener).
    window.open(producto.enlaceCompra, '_blank', 'noopener,noreferrer');
  };
}
