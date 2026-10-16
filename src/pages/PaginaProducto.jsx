// ============================================================
// PaginaProducto.jsx
// Página aparte de un producto: carrusel de multimedia, descripción,
// precio (COP), categoría, stock y botón Comprar.
// ============================================================

import Carrusel from '../components/catalogo/Carrusel';
import { useAuth } from '../context/AuthContext';
import { useProductos } from '../context/ProductosContext';
import { useComprar } from '../hooks/useComprar';
import { formatoCop } from '../utils/formatos';

export default function PaginaProducto({ id }) {
  const { productos } = useProductos();
  const { esAdmin } = useAuth();
  const manejarCompra = useComprar();

  const producto = productos.find((p) => p.id === id);

  // Si no existe, o está inactivo y quien mira no es admin, se muestra un aviso.
  if (!producto || (!producto.activo && !esAdmin)) {
    return (
      <section className="contenedor vacio">
        <h1 className="vacio__titulo">Producto no disponible</h1>
        <p>El producto que buscas no existe o ya no está disponible.</p>
        <a className="boton boton--primario" href="#/">
          Volver al catálogo
        </a>
      </section>
    );
  }

  const agotado = producto.stock <= 0;

  return (
    <article className="producto contenedor">
      <nav className="migas" aria-label="Ruta de navegación">
        <a href="#/">Catálogo</a>
        <span aria-hidden="true"> / </span>
        <span>{producto.categoria}</span>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{producto.nombre}</span>
      </nav>

      <div className="producto__rejilla">
        <Carrusel key={producto.id} multimedia={producto.multimedia} nombre={producto.nombre} />

        <div className="producto__info">
          <p className="producto__etiquetas">
            <span className="insignia insignia--id">ID: {producto.id}</span>
            <span className="insignia insignia--categoria">{producto.categoria}</span>
            {!producto.activo && <span className="insignia insignia--critica">Inactivo</span>}
          </p>

          <h1 className="producto__titulo">{producto.nombre}</h1>

          <p className="producto__precio">
            <span className="producto__precio-valor">{formatoCop(producto.precio)}</span>
            <span className="producto__precio-moneda">COP</span>
          </p>

          <p className={`producto__stock ${agotado ? 'producto__stock--agotado' : ''}`}>
            {agotado ? 'Producto agotado' : `En stock: ${producto.stock} unidades disponibles`}
          </p>

          <section aria-labelledby="titulo-descripcion">
            <h2 id="titulo-descripcion" className="producto__subtitulo">
              Descripción
            </h2>
            <p className="producto__descripcion">{producto.descripcion}</p>
          </section>

          <div className="producto__acciones">
            <button
              type="button"
              className="boton boton--primario boton--grande"
              disabled={agotado || !producto.activo}
              onClick={(evento) => manejarCompra(evento, producto)}
            >
              {agotado ? 'Agotado' : 'Comprar ahora'}
            </button>
            <a className="boton boton--secundario boton--grande" href="#/">
              ← Volver al catálogo
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
