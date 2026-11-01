// ============================================================
// BotonWhatsApp.jsx
// Botón fijo en la esquina inferior izquierda que lleva a WhatsApp.
// Enlace y mensaje definidos en Claude.md.
//
// Debajo del texto principal hay un aviso legal con enlace a la Política
// de datos: así la persona la conoce ANTES de escribir, y escribir por
// WhatsApp cuenta como su autorización (Decreto 1377 de 2013, art. 7).
//
// Un enlace no puede ir dentro de otro enlace (HTML no válido), por eso:
//   - El contenedor <aside> es la "píldora" verde.
//   - El enlace a WhatsApp ocupa toda la píldora con un ::after (ver layout.css).
//   - El enlace a la política queda por encima, así se puede pulsar aparte.
// ============================================================

import { enlaceInterno } from '../../utils/rutasCifradas';

const ENLACE_WHATSAPP = 'https://wa.link/vtp65t';

export default function BotonWhatsApp() {
  return (
    <aside className="whatsapp" aria-label="Atención por WhatsApp">
      <a
        className="whatsapp__enlace"
        href={ENLACE_WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp: ¿Quieres más información?"
      >
        {/* Icono de burbuja de chat dibujado en SVG (sin librerías de iconos) */}
        <svg className="whatsapp__icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M12 3C6.5 3 2 6.8 2 11.5c0 2.4 1.2 4.6 3.1 6.1L4 21l4.2-1.8c1.2.4 2.5.6 3.8.6 5.5 0 10-3.8 10-8.5S17.5 3 12 3Z"
          />
        </svg>
        <span className="whatsapp__texto">¿Quieres más información?</span>
      </a>

      {/* Aviso legal debajo del texto principal */}
      <p className="whatsapp__legal">
        Al escribirnos aceptas la <a href={enlaceInterno('/privacidad')}>Política de datos</a>
      </p>
    </aside>
  );
}
