// ============================================================
// FormularioCategoria.jsx
// Ventana modal para crear una categoría: un solo campo y el botón Guardar.
// Validación en dos niveles:
//   1) FrontEnd: validarCategoria (obligatoria y sin repetir) al escribir/enviar.
//   2) BackEnd: categoriasService vuelve a validar y la base de datos impide
//      repetidos con su restricción UNIQUE (onGuardar).
// ============================================================

import { useState } from 'react';
import { validarCategoria } from '../../services/categoriasService';
import Campo from '../ui/Campo';
import Modal from '../ui/Modal';

export default function FormularioCategoria({ categorias, onGuardar, onCerrar }) {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  // true mientras se espera la respuesta de Supabase.
  const [guardando, setGuardando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();

    // 1) Validación de FrontEnd.
    const errorFront = validarCategoria(nombre, categorias);
    if (errorFront !== '') {
      setError(errorFront);
      return;
    }

    // 2) Guardado: el servicio (BackEnd) valida otra vez y puede devolver un error.
    setGuardando(true);
    const resultado = await onGuardar(nombre);
    if (!resultado.ok) {
      setError(resultado.error);
      setGuardando(false);
    }
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
          <button type="submit" className="boton boton--primario" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
