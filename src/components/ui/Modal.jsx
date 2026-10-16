// ============================================================
// Modal.jsx
// Ventana modal con el estilo de la web (reemplaza a confirm/prompt).
// Se cierra con la tecla Escape o pulsando el fondo oscuro.
// ============================================================

import { useEffect } from 'react';

export default function Modal({ titulo, onCerrar, children, ancho = 'normal' }) {
  // Cierra la modal al pulsar Escape.
  useEffect(() => {
    function alPulsarTecla(evento) {
      if (evento.key === 'Escape') onCerrar();
    }
    document.addEventListener('keydown', alPulsarTecla);
    return () => document.removeEventListener('keydown', alPulsarTecla);
  }, [onCerrar]);

  return (
    <div className="modal__fondo" onClick={onCerrar}>
      {/* stopPropagation evita que pulsar dentro de la modal la cierre */}
      <section
        className={`modal modal--${ancho}`}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(evento) => evento.stopPropagation()}
      >
        <header className="modal__cabecera">
          <h2 className="modal__titulo">{titulo}</h2>
          <button type="button" className="boton boton--icono" onClick={onCerrar} aria-label="Cerrar ventana">
            ✕
          </button>
        </header>
        <div className="modal__cuerpo">{children}</div>
      </section>
    </div>
  );
}
