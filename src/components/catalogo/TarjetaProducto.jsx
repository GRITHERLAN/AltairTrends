// ============================================================
// TarjetaProducto.jsx
// Tarjeta del catálogo: ID, categoría, stock, nombre, descripción,
// precio y los dos botones (Ver producto / Comprar).
// ============================================================

import { useComprar } from '../../hooks/useComprar';
import { formatoCop } from '../../utils/formatos';
import MediaProducto from './MediaProducto';

// Por debajo de este stock se muestra la etiqueta en ámbar ("pocas unidades").
const STOCK_BAJO = 8;

export default function TarjetaProducto({ producto }) {
  const manejarCompra = useComprar();
  const agotado = producto.stock <= 0;
  const claseStock = agotado ? 'insignia--critica' : producto.stock < STOCK_BAJO ? 'insignia--alerta' : 'insignia--exito';

  return (
    <article className="tarjeta">
      <div className="tarjeta__media">
        <MediaProducto medio={producto.multimedia[0]} nombre={producto.nombre} />
        <div className="tarjeta__etiquetas">
          <span className="insignia insignia--id">{producto.id}</span>
          <span className="insignia insignia--categoria">{producto.categoria}</span>
          <span className={`insignia ${claseStock}`}>{agotado ? 'Agotado' : `Stock: ${producto.stock}`}</span>
        </div>
      </div>

      <div className="tarjeta__cuerpo">
        <h3 className="tarjeta__titulo">{producto.nombre}</h3>
        <p className="tarjeta__descripcion">{producto.descripcion}</p>

        <p className="tarjeta__precio">
          <span className="tarjeta__precio-etiqueta">Precio exclusivo</span>
          <span className="tarjeta__precio-valor">{formatoCop(producto.precio)}</span>
          <span className="tarjeta__precio-moneda">COP</span>
        </p>

        <div className="tarjeta__acciones">
          {/* Este enlace estira su área clicable a toda la tarjeta (ver .tarjeta__enlace en CSS) */}
          <a className="boton boton--secundario tarjeta__enlace" href={`#/producto/${encodeURIComponent(producto.id)}`}>
            Ver producto
          </a>
          <button
            type="button"
            className="boton boton--primario"
            disabled={agotado}
            onClick={(evento) => manejarCompra(evento, producto)}
          >
            {agotado ? 'Agotado' : 'Comprar'}
          </button>
        </div>
      </div>
    </article>
  );
}
