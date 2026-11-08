// ============================================================
// FiltrosUsuario.jsx
// Barra de filtros del catálogo público: ID, nombre, categoría y orden.
// (Solo se muestran productos activos; el filtro de estado es del admin.)
// ============================================================

import { useState } from 'react';
import { rutaCategoria } from '../../utils/categorias';
import { OPCIONES_ORDEN } from '../../utils/filtrarProductos';
import Campo from '../ui/Campo';

// categorias: [{ slug, nombre }] (ver utils/categorias.js). categoriaActual: slug o null ("Todas").
// Los chips son ENLACES a /categoria/<slug> (no botones): así Google descubre cada categoría.
export default function FiltrosUsuario({ filtros, onCambiar, categorias, categoriaActual, onLimpiar }) {
  // En móvil los filtros son un menú desplegable: este estado indica si está abierto.
  // En escritorio el CSS ignora este estado y siempre muestra los filtros.
  const [abierto, setAbierto] = useState(false);

  // Actualiza un solo filtro sin perder los demás.
  function cambiar(campo, valor) {
    onCambiar({ ...filtros, [campo]: valor });
  }

  return (
    <form className="filtros filtros--fijo" onSubmit={(evento) => evento.preventDefault()} aria-label="Filtros del catálogo">
      {/* Barra superior (solo móvil): botón "Filtros" + buscador por nombre siempre visible,
          aunque el menú esté cerrado. En escritorio el CSS oculta esta barra. */}
      <div className="filtros__barra-movil">
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

        {/* Segundo input de nombre: comparte el mismo estado "filtros.nombre" que el de escritorio. */}
        <div className="filtros__buscador-movil">
          <Campo id="filtro-nombre-movil" etiqueta="Buscar por nombre" valor={filtros.nombre} placeholder="Buscar producto" onCambio={(e) => cambiar('nombre', e.target.value)} />
        </div>
      </div>

      <div id="filtros-contenido" className={`filtros__contenido ${abierto ? 'filtros__contenido--abierto' : ''}`}>
      <div className="filtros__fila">
        <Campo id="filtro-id" etiqueta="Buscar por ID" valor={filtros.id} placeholder="Ej.: ALT-101" onCambio={(e) => cambiar('id', e.target.value)} />
        {/* Buscador de escritorio: en móvil se oculta porque el buscador vive en la barra superior. */}
        <div className="filtros__campo-nombre-escritorio">
          <Campo id="filtro-nombre" etiqueta="Buscar por nombre" valor={filtros.nombre} placeholder="Nombre del producto" onCambio={(e) => cambiar('nombre', e.target.value)} />
        </div>
        <Campo
          id="filtro-orden"
          tipo="select"
          etiqueta="Ordenar por"
          valor={filtros.orden}
          opciones={OPCIONES_ORDEN}
          onCambio={(e) => cambiar('orden', e.target.value)}
        />
      </div>

      <nav className="filtros__categorias" aria-label="Categorías">
        <span className="filtros__categorias-titulo">Categorías:</span>
        {[{ slug: null, nombre: 'Todas' }, ...categorias].map(({ slug, nombre }) => {
          const activa = slug === categoriaActual;
          return (
            <a
              key={slug ?? 'todas'}
              href={slug ? rutaCategoria(slug) : '/'}
              className={`chip ${activa ? 'chip--activo' : ''}`}
              aria-current={activa ? 'page' : undefined}
            >
              {nombre}
            </a>
          );
        })}
        <button type="button" className="boton boton--enlace" onClick={onLimpiar}>
          Limpiar filtros
        </button>
      </nav>
      </div>
    </form>
  );
}
