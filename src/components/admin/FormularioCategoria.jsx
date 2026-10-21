// ============================================================
// FormularioCategoria.jsx
// Ventana modal para crear una categoría: un solo campo y el botón Guardar.
// Validación en dos niveles:
//   1) FrontEnd: validarCategoria (obligatoria y sin repetir) al escribir/enviar.
//   2) BackEnd: categoriasService vuelve a validar al guardar (onGuardar).
// ============================================================

import { useState } from 'react';
import { validarCategoria } from '../../services/categoriasService';
import Campo from '../ui/Campo';
import Modal from '../ui/Modal';

export default function FormularioCategoria({ categorias, onGuardar, onCerrar }) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  function manejarEnvio(evento) {
    evento.preventDefault();

    // 1) Validación de FrontEnd.
    const errorFront = validarCategoria(nombre, categorias);
    if (errorFront !== '') {
      setError(errorFront);
      return;
    }

    // 2) Guardado: el servicio (BackEnd) valida otra vez y puede devolver un error.
    const resultado = onGuardar(nombre);
    if (!resultado.ok) setError(resultado.error);
  }

  return (
    <Modal titulo="Crear categoría" onCerrar={onCerrar} ancho="estrecho">
      <form className="formulario" onSubmit={manejarEnvio} noValidate>
        <Campo
          id="categoria-nombre"
          etiqueta="Nombre de la categoría"
          valor={nombre}
          error={error}
          placeholder="Ej.: Accesorios"
          autoFocus
          onCambio={(e) => {
            setNombre(e.target.value);
            setError('');
          }}
        />

        <div className="modal__acciones">
          <button type="button" className="boton boton--secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="boton boton--primario">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
}
