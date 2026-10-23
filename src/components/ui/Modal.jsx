// ============================================================
// Modal.jsx
// Ventana modal con el estilo de la web (reemplaza a confirm/prompt).
// Se cierra con la tecla Escape o pulsando el fondo oscuro.
//
// Navegación por teclado:
//   - Al abrirse, el foco pasa al primer control de la ventana.
//   - Tab y Shift+Tab dan la vuelta dentro de la ventana (no se escapan a la página).
//   - Al cerrarse, el foco vuelve al botón que la abrió.
// ============================================================

import { useEffect, useRef } from 'react';

// Elementos que pueden recibir el foco con Tab.
const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ titulo, onCerrar, children, ancho = 'normal' }) {
  const ventanaRef = useRef(null);
  // Se guarda la última versión de onCerrar para no reiniciar el efecto en cada render.
  const cerrarRef = useRef(onCerrar);
  cerrarRef.current = onCerrar;

  useEffect(() => {
    // Elemento que tenía el foco antes de abrir (normalmente, el botón que abrió la modal).
    const focoAnterior = document.activeElement;
    const ventana = ventanaRef.current;

    // Primer control de la ventana, saltando el botón de cerrar (✕) si hay otros.
    const controles = Array.from(ventana.querySelectorAll(ENFOCABLES));
    const primero = controles.find((control) => !control.classList.contains('modal__cerrar')) ?? controles[0] ?? ventana;
    primero.focus();

    function alPulsarTecla(evento) {
      if (evento.key === 'Escape') {
        cerrarRef.current();
        return;
      }
      if (evento.key !== 'Tab') return;

      // Mantiene el foco dentro de la ventana.
      const enfocables = Array.from(ventana.querySelectorAll(ENFOCABLES));
      if (enfocables.length === 0) return;
      const inicio = enfocables[0];
      const fin = enfocables[enfocables.length - 1];

      if (evento.shiftKey && document.activeElement === inicio) {
        evento.preventDefault();
        fin.focus();
      } else if (!evento.shiftKey && document.activeElement === fin) {
        evento.preventDefault();
        inicio.focus();
      }
    }

    document.addEventListener('keydown', alPulsarTecla);
    return () => {
      document.removeEventListener('keydown', alPulsarTecla);
      // Devuelve el foco a donde estaba (si ese elemento sigue en la página).
      if (focoAnterior instanceof HTMLElement && document.contains(focoAnterior)) focoAnterior.focus();
    };
  }, []);

  return (
    <div className="modal__fondo" onClick={onCerrar}>
      {/* stopPropagation evita que pulsar dentro de la modal la cierre */}
      <section
        ref={ventanaRef}
        className={`modal modal--${ancho}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        tabIndex={-1}
        onClick={(evento) => evento.stopPropagation()}
      >
        <header className="modal__cabecera">
          <h2 id="modal-titulo" className="modal__titulo">
            {titulo}
          </h2>
          <button type="button" className="boton boton--icono modal__cerrar" onClick={onCerrar} aria-label="Cerrar ventana">
            ✕
          </button>
        </header>
        <div className="modal__cuerpo">{children}</div>
      </section>
    </div>
  );
}
