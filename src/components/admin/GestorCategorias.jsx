// ============================================================
// GestorCategorias.jsx
// Modal "Categorías" del panel de administración:
//   - Barra de búsqueda para filtrar la lista.
//   - Lista de categorías existentes; cada una con Editar y Eliminar.
//   - Abajo: "Crear categoría" y "Cancelar".
// "Crear categoría" y "Editar" cambian la misma modal a un formulario con un
// solo campo. La validación es la de categoriasService (FrontEnd + BackEnd).
// ============================================================

import { useState } from 'react';
import { validarCategoria } from '../../services/categoriasService';
import Campo from '../ui/Campo';
import Modal from '../ui/Modal';

export default function GestorCategorias({ categorias, productos, onCrear, onRenombrar, onEliminar, onCerrar }) {
  const [busqueda, setBusqueda] = useState('');
  // Vista actual: { tipo: 'lista' } | { tipo: 'crear' } | { tipo: 'editar', nombre } | { tipo: 'borrar', nombre }
  const [vista, setVista] = useState({ tipo: 'lista' });
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const visibles = categorias.filter((c) => c.toLowerCase().includes(busqueda.trim().toLowerCase()));
  const usos = (categoria) => productos.filter((p) => p.categoria === categoria).length;

  function irA(nuevaVista, texto = '') {
    setVista(nuevaVista);
    setNombre(texto);
    setError('');
  }

  async function guardar(evento) {
    evento.preventDefault();
    const editando = vista.tipo === 'editar';
    const otras = editando ? categorias.filter((c) => c !== vista.nombre) : categorias;
    const errorFront = validarCategoria(nombre, otras);
    if (errorFront !== '') {
      setError(errorFront);
      return;
    }
    setOcupado(true);
    const resultado = editando ? await onRenombrar(vista.nombre, nombre, categorias) : await onCrear(nombre, categorias);
    setOcupado(false);
    if (resultado.ok) irA({ tipo: 'lista' });
    else setError(resultado.error);
  }

  async function borrar() {
    setOcupado(true);
    const resultado = await onEliminar(vista.nombre);
    setOcupado(false);
    if (resultado.ok) irA({ tipo: 'lista' });
    else setError(resultado.error);
  }

  // ---- Crear / editar ----
  if (vista.tipo === 'crear' || vista.tipo === 'editar') {
    return (
      <Modal titulo={vista.tipo === 'crear' ? 'Crear categoría' : 'Editar categoría'} onCerrar={onCerrar} ancho="estrecho">
        <form className="formulario" onSubmit={guardar} noValidate>
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
            <button type="button" className="boton boton--secundario" onClick={() => irA({ tipo: 'lista' })}>
              Cancelar
            </button>
            <button type="submit" className="boton boton--primario" disabled={ocupado}>
              {ocupado ? 'Guardando...' : vista.tipo === 'crear' ? 'Crear categoría' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  // ---- Confirmar eliminación ----
  if (vista.tipo === 'borrar') {
    return (
      <Modal titulo="Eliminar categoría" onCerrar={onCerrar} ancho="estrecho">
        <p className="modal__mensaje">
          ¿Seguro que quieres eliminar la categoría "{vista.nombre}"? Esta acción no se puede deshacer.
        </p>
        {error && (
          <p className="campo__error" role="alert">
            {error}
          </p>
        )}
        <div className="modal__acciones">
          <button type="button" className="boton boton--secundario" onClick={() => irA({ tipo: 'lista' })}>
            Cancelar
          </button>
          <button type="button" className="boton boton--peligro" onClick={borrar} disabled={ocupado}>
            {ocupado ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </Modal>
    );
  }

  // ---- Lista ----
  return (
    <Modal titulo="Categorías" onCerrar={onCerrar} ancho="normal">
      <Campo
        id="categoria-busqueda"
        etiqueta="Buscar categoría"
        tipo="search"
        valor={busqueda}
        placeholder="Escribe para filtrar..."
        onCambio={(e) => setBusqueda(e.target.value)}
      />

      <ul className="lista-categorias" aria-label="Categorías existentes">
        {visibles.length === 0 && <li className="catalogo__subtitulo">No hay categorías que coincidan.</li>}
        {visibles.map((categoria) => (
          <li key={categoria} className="lista-categorias__item">
            <span className="lista-categorias__nombre">
              {categoria} <small>({usos(categoria)} productos)</small>
            </span>
            <span className="lista-categorias__acciones">
              <button type="button" className="boton boton--secundario" onClick={() => irA({ tipo: 'editar', nombre: categoria }, categoria)}>
                Editar
              </button>
              <button
                type="button"
                className="boton boton--secundario"
                onClick={() => irA({ tipo: 'borrar', nombre: categoria })}
                disabled={usos(categoria) > 0}
                title={usos(categoria) > 0 ? 'Tiene productos: cámbialos de categoría para poder eliminarla' : undefined}
              >
                Eliminar
              </button>
            </span>
          </li>
        ))}
      </ul>

      <div className="modal__acciones">
        <button type="button" className="boton boton--secundario" onClick={onCerrar}>
          Cancelar
        </button>
        <button type="button" className="boton boton--primario" onClick={() => irA({ tipo: 'crear' })}>
          Crear categoría
        </button>
      </div>
    </Modal>
  );
}
