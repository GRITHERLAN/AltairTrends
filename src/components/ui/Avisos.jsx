// ============================================================
// Avisos.jsx
// Pinta en pantalla la lista de avisos (toasts) del AvisosContext.
// role="status" hace que los lectores de pantalla los anuncien.
// ============================================================

import { useAvisos } from '../../context/AvisosContext';

export default function Avisos() {
  const { avisos, cerrarAviso } = useAvisos();

  return (
    <div className="avisos" role="status" aria-live="polite">
      {avisos.map((aviso) => (
        <div key={aviso.id} className={`aviso aviso--${aviso.tipo}`}>
          <p className="aviso__texto">{aviso.texto}</p>
          <button type="button" className="aviso__cerrar" onClick={() => cerrarAviso(aviso.id)} aria-label="Cerrar aviso">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
