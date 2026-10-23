// ============================================================
// useComprar.js
// Lógica del botón "Comprar" (la comparten la tarjeta y la página del producto):
//   1) registra la compra en el servidor (valida activo y stock > 0, sin tocar el stock),
//   2) avisa visualmente,
//   3) abre el enlace de compra configurado por el administrador.
//
// Detalle importante: los navegadores bloquean las ventanas que se abren
// DESPUÉS de esperar al servidor. Por eso la pestaña nueva se abre vacía
// en el mismo clic y se le pone el enlace cuando el servidor responde.
// ============================================================

import { useAvisos } from '../context/AvisosContext';
import { useProductos } from '../context/ProductosContext';
import { esUrlValida } from '../services/productosService';

export function useComprar() {
  const { comprar } = useProductos();
  const { mostrarAviso } = useAvisos();

  return async function manejarCompra(evento, producto) {
    // Evita cualquier comportamiento por defecto del botón/enlace.
    evento.preventDefault();

    // 0) Seguridad: solo se redirige a enlaces http(s). La base de datos ya lo exige,
    //    pero si un dato llegara manipulado (por ejemplo "javascript:..."), no se ejecuta.
    if (!esUrlValida(producto.enlaceCompra)) {
      mostrarAviso('error', 'El enlace de compra de este producto no es válido. Escríbenos por WhatsApp.');
      return;
    }

    // 1) Pestaña vacía abierta durante el clic (puede ser null si el navegador la bloquea).
    const pestana = window.open('', '_blank');

    // 2) Validación y registro en el servidor.
    const resultado = await comprar(producto.id);
    if (!resultado.ok) {
      if (pestana) pestana.close();
      mostrarAviso('error', resultado.error);
      return;
    }

    mostrarAviso('exito', `Compra registrada: "${producto.nombre}". Te llevamos al enlace de compra.`);

    // 3) Redirección. Se corta el acceso de la pestaña nueva a esta ventana (seguridad).
    if (pestana) {
      pestana.opener = null;
      pestana.location.href = producto.enlaceCompra;
    } else {
      // Si el navegador bloqueó la pestaña, se abre el enlace en esta misma.
      window.location.assign(producto.enlaceCompra);
    }
  };
}
