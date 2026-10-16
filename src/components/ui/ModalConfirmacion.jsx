// ============================================================
// ModalConfirmacion.jsx
// Pregunta "¿Estás seguro?" con el estilo de la web (sustituye a confirm()).
// ============================================================

import Modal from './Modal';

export default function ModalConfirmacion({ titulo, mensaje, textoConfirmar = 'Confirmar', onConfirmar, onCancelar }) {
  return (
    <Modal titulo={titulo} onCerrar={onCancelar} ancho="estrecho">
      <p className="modal__mensaje">{mensaje}</p>
      <div className="modal__acciones">
        <button type="button" className="boton boton--secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="button" className="boton boton--peligro" onClick={onConfirmar}>
          {textoConfirmar}
        </button>
      </div>
    </Modal>
  );
}
