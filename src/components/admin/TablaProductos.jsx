// ============================================================
// TablaProductos.jsx
// Tabla del inventario con las acciones: editar, activar/desactivar y borrar.
// ============================================================

import MediaProducto from '../catalogo/MediaProducto';
import { formatoCop, formatoFecha, requiereModificacion, textoAntiguedad } from '../../utils/formatos';
import { STOCK_CRITICO } from './ResumenKpis';

export default function TablaProductos({ productos, onEditar, onCambiarEstado, onBorrar }) {
  if (productos.length === 0) {
    return (
      <div className="vacio">
        <p className="vacio__titulo">No hay productos que coincidan con los filtros.</p>
      </div>
    );
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <caption className="sr-solo">Catálogo completo de productos</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Miniatura</th>
            <th scope="col">Producto y categoría</th>
            <th scope="col">Precio (COP)</th>
            <th scope="col">Stock</th>
            <th scope="col">Fecha de ingreso</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => {
            const antiguo = requiereModificacion(producto);
            const critico = producto.stock < STOCK_CRITICO;

            return (
              <tr key={producto.id} className={producto.activo ? '' : 'tabla__fila--inactiva'}>
                <th scope="row" className="tabla__id">
                  {producto.id}
                </th>
                <td>
                  <div className="tabla__miniatura">
                    <MediaProducto medio={producto.multimedia[0]} nombre={producto.nombre} />
                  </div>
                </td>
                <td>
                  <strong className="tabla__nombre">{producto.nombre}</strong>
                  <span className="tabla__categoria">{producto.categoria}</span>
                </td>
                <td>{formatoCop(producto.precio)}</td>
                <td>
                  {critico ? (
                    <span className="insignia insignia--critica">{producto.stock} uds (crítico)</span>
                  ) : (
                    `${producto.stock} uds`
                  )}
                </td>
                <td>
                  {formatoFecha(producto.fechaCreacion)}
                  <span className={`tabla__antiguedad ${antiguo ? 'tabla__antiguedad--alerta' : ''}`}>
                    {textoAntiguedad(producto.fechaCreacion)}
                    {antiguo && ' · requiere modificación'}
                  </span>
                </td>
                <td>
                  <span className={`insignia ${producto.activo ? 'insignia--exito' : 'insignia--neutra'}`}>
                    {producto.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="tabla__acciones">
                    <button type="button" className="boton boton--secundario boton--pequeno" onClick={() => onEditar(producto)}>
                      Editar
                    </button>
                    {/* Si está activo aparece "Desactivar"; si está inactivo aparece "Activar" */}
                    <button
                      type="button"
                      className={`boton boton--pequeno ${producto.activo ? 'boton--secundario' : 'boton--primario'}`}
                      onClick={() => onCambiarEstado(producto)}
                    >
                      {producto.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button type="button" className="boton boton--peligro boton--pequeno" onClick={() => onBorrar(producto)}>
                      Borrar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
