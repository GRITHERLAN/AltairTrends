// ============================================================
// MediaProducto.jsx
// Muestra una imagen o un video de un producto.
// Si el producto no tiene multimedia, muestra un marcador con el logo.
// ============================================================

import logo from '../../assets/logo.webp';

// "prioridad": la imagen es lo principal de la página (ficha de producto) y se
// carga de inmediato en vez de esperar al scroll (mejora el LCP de Core Web Vitals).
export default function MediaProducto({ medio, nombre, controles = false, prioridad = false }) {
  // Sin multimedia: marcador de posición.
  if (!medio) {
    return (
      <div className="media media--vacio">
        <img className="media__logo" src={logo} alt="" width="169" height="220" />
        <span className="media__texto">Sin imagen</span>
      </div>
    );
  }

  if (medio.tipo === 'video') {
    return <video className="media__archivo" src={medio.url} controls={controles} muted preload="metadata" />;
  }

  return <img className="media__archivo" src={medio.url} alt={nombre} loading={prioridad ? 'eager' : 'lazy'} />;
}
