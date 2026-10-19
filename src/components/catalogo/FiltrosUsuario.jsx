// ============================================================
// FiltrosUsuario.jsx
// Barra de filtros del catálogo público: ID, nombre, categoría y orden.
// (Solo se muestran productos activos; el filtro de estado es del admin.)
// ============================================================

import { useState } from 'react';
import { OPCIONES_ORDEN } from '../../utils/filtrarProductos';
import Campo from '../ui/Campo';

export default function FiltrosUsuario({ filtros, onCambiar, categorias, onLimpiar }) {
  // En móvil los filtros son un menú desplegable: este estado indica si está abierto.
  // En escritorio el CSS ignora este estado y siempre muestra los filtros.
  const [abierto, setAbierto] = useState(false);

  // Actualiza un solo filtro sin perder los demás.
  function cambiar(campo, valor) {
    onCambiar({ ...filtros, [campo]: valor });
  }

  return (
    <form className="filtros filtros--fijo" onSubmit={(evento) => evento.preventDefault()} aria-label="Filtros del catálogo">
      {/* Botón que abre/cierra el menú (solo visible en móvil). */}
      <button
        type="button"
        className="filtros__toggle"
        aria-expanded={abierto}
        aria-controls="filtros-contenido"
        onClick={(evento) => {
          evento.preventDefault();
          setAbierto(!abierto);
        }}
      >
        <span>Filtros</span>
        <span className={`filtros__flecha ${abierto ? 'filtros__flecha--abierta' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      <div id="filtros-contenido" className={`filtros__contenido ${abierto ? 'filtros__contenido--abierto' : ''}`}>
      <div className="filtros__fila">
        <Campo id="filtro-id" etiqueta="Buscar por ID" valor={filtros.id} placeholder="Ej.: ALT-101" onCambio={(e) => cambiar('id', e.target.value)} />
        <Campo id="filtro-nombre" etiqueta="Buscar por nombre" valor={filtros.nombre} placeholder="Nombre del producto" onCambio={(e) => cambiar('nombre', e.target.value)} />
        <Campo
          id="filtro-orden"
          tipo="select"
          etiqueta="Ordenar por"
          valor={filtros.orden}
          opciones={OPCIONES_ORDEN}
          onCambio={(e) => cambiar('orden', e.target.value)}
        />
      </div>

      <div className="filtros__categorias" role="group" aria-label="Categorías">
        <span className="filtros__categorias-titulo">Categorías:</span>
        {['todas', ...categorias].map((categoria) => (
          <button
            key={categoria}
            type="button"
            className={`chip ${filtros.categoria === categoria ? 'chip--activo' : ''}`}
            aria-pressed={filtros.categoria === categoria}
            onClick={(evento) => {
              evento.preventDefault();
              cambiar('categoria', categoria);
            }}
          >
            {categoria === 'todas' ? 'Todas' : categoria}
          </button>
        ))}
        <button type="button" className="boton boton--enlace" onClick={onLimpiar}>
          Limpiar filtros
        </button>
      </div>
      </div>
    </form>
  );
}
