// ============================================================
// ModalConfirmacion.jsx
// Pregunta "¿Estás seguro?" con el estilo de la web (sustituye a confirm()).
// "onConfirmar" puede ser asíncrona: mientras el servidor responde, los
// botones se desactivan para evitar dobles clics.
// ============================================================

import { useState } from 'react';
import Modal from './Modal';

export default function ModalConfirmacion({ titulo, mensaje, textoConfirmar = 'Confirmar', onConfirmar, onCancelar }) {
  const [procesando, setProcesando] = useState(false);

  async function confirmar(evento) {
    evento.preventDefault();
    setProcesando(true);
    await onConfirmar();
    // Normalmente la modal ya se cerró; si sigue abierta, se reactivan los botones.
    setProcesando(false);
  }

  return (
    <Modal titulo={titulo} onCerrar={procesando ? () => {} : onCancelar} ancho="estrecho">
      <p className="modal__mensaje">{mensaje}</p>
      <div className="modal__acciones">
        <button type="button" className="boton boton--secundario" onClick={onCancelar} disabled={procesando}>
          Cancelar
        </button>
        <button type="button" className="boton boton--peligro" onClick={confirmar} disabled={procesando}>
          {procesando ? 'Procesando...' : textoConfirmar}
        </button>
      </div>
    </Modal>
  );
}
