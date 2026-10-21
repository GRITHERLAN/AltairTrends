// ============================================================
// FiltrosAdmin.jsx
// Filtros del panel: ID, nombre, estado (todos / activos / inactivos),
// categoría y orden (fecha, precio, stock, recientes).
// ============================================================

import { useState } from 'react';
import { OPCIONES_ORDEN } from '../../utils/filtrarProductos';
import Campo from '../ui/Campo';

export default function FiltrosAdmin({ filtros, onCambiar, categorias, conteo, onLimpiar }) {
  // En móvil los filtros son un menú desplegable: este estado indica si está abierto.
  // En escritorio el CSS ignora este estado y siempre muestra los filtros.
  const [abierto, setAbierto] = useState(false);

  function cambiar(campo, valor) {
    onCambiar({ ...filtros, [campo]: valor });
  }

  // Botones de estado con su contador.
  const estados = [
    { valor: 'todos', texto: `Todos (${conteo.todos})` },
    { valor: 'activos', texto: `Activos (${conteo.activos})` },
    { valor: 'inactivos', texto: `Inactivos (${conteo.inactivos})` },
  ];

  const opcionesCategoria = [{ valor: 'todas', texto: 'Todas las categorías' }, ...categorias.map((c) => ({ valor: c, texto: c }))];

  return (
    <form className="filtros filtros--fijo tarjeta-panel" onSubmit={(evento) => evento.preventDefault()} aria-label="Filtros del inventario">
      {/* Botón que abre/cierra el menú (solo visible en móvil). */}
      <button
        type="button"
        className="filtros__toggle"
        aria-expanded={abierto}
        aria-controls="admin-filtros-contenido"
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

      <div id="admin-filtros-contenido" className={`filtros__contenido ${abierto ? 'filtros__contenido--abierto' : ''}`}>
      <div className="filtros__fila">
        <Campo id="admin-filtro-id" etiqueta="Filtrar por ID" valor={filtros.id} placeholder="Ej.: ALT-101" onCambio={(e) => cambiar('id', e.target.value)} />
        <Campo id="admin-filtro-nombre" etiqueta="Filtrar por nombre" valor={filtros.nombre} placeholder="Nombre del producto" onCambio={(e) => cambiar('nombre', e.target.value)} />
        <Campo id="admin-filtro-categoria" tipo="select" etiqueta="Categoría" valor={filtros.categoria} opciones={opcionesCategoria} onCambio={(e) => cambiar('categoria', e.target.value)} />
        <Campo id="admin-filtro-orden" tipo="select" etiqueta="Ordenar por" valor={filtros.orden} opciones={OPCIONES_ORDEN} onCambio={(e) => cambiar('orden', e.target.value)} />
      </div>

      <div className="filtros__categorias" role="group" aria-label="Estado del producto">
        {estados.map((estado) => (
          <button
            key={estado.valor}
            type="button"
            className={`chip ${filtros.estado === estado.valor ? 'chip--activo' : ''}`}
            aria-pressed={filtros.estado === estado.valor}
            onClick={(evento) => {
              evento.preventDefault();
              cambiar('estado', estado.valor);
            }}
          >
            {estado.texto}
          </button>
        ))}
        {filtros.soloAntiguos && <span className="insignia insignia--alerta">Solo productos antiguos</span>}
        <button type="button" className="boton boton--enlace" onClick={onLimpiar}>
          Limpiar filtros
        </button>
      </div>
      </div>
    </form>
  );
}
