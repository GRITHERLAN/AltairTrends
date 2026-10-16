// ============================================================
// MediaProducto.jsx
// Muestra una imagen o un video de un producto.
// Si el producto no tiene multimedia, muestra un marcador con el logo.
// ============================================================

import logo from '../../assets/logo.png';

export default function MediaProducto({ medio, nombre, controles = false }) {
  // Sin multimedia: marcador de posición.
  if (!medio) {
    return (
      <div className="media media--vacio">
        <img className="media__logo" src={logo} alt="" />
        <span className="media__texto">Sin imagen</span>
      </div>
    );
  }

  if (medio.tipo === 'video') {
    return <video className="media__archivo" src={medio.url} controls={controles} muted preload="metadata" />;
  }

  return <img className="media__archivo" src={medio.url} alt={nombre} loading="lazy" />;
}
