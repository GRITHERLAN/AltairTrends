// ============================================================
// BotonWhatsApp.jsx
// Botón fijo en la esquina inferior izquierda que lleva a WhatsApp.
// Enlace y mensaje definidos en Claude.md.
// ============================================================

const ENLACE_WHATSAPP = 'https://wa.link/vtp65t';

export default function BotonWhatsApp() {
  return (
    <a
      className="whatsapp"
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
  );
}
