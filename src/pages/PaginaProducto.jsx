// ============================================================
// PaginaProducto.jsx
// Página aparte de un producto: carrusel de multimedia, descripción,
// precio (COP), categoría, stock y botón Comprar.
// ============================================================

import { useEffect } from 'react';
import Carrusel from '../components/catalogo/Carrusel';
import { useAuth } from '../context/AuthContext';
import { useProductos } from '../context/ProductosContext';
import { useComprar } from '../hooks/useComprar';
import { recortar, urlAbsoluta, useMetaPagina } from '../hooks/useMetaPagina';
import { reemplazarRuta } from '../hooks/useRuta';
import { rutaCategoria } from '../utils/categorias';
import { formatoCop, formatoFecha } from '../utils/formatos';
import { buscarProductoPorSlug, rutaProducto } from '../utils/slug';

// Datos estructurados para Google y agentes de IA: ficha de producto con precio
// y disponibilidad, la acción de compra (BuyAction -> WhatsApp) y las migas
// (Catálogo > Categoría > Producto). La política de devoluciones está en index.html.
function schemaProducto(producto, nombreCategoria) {
  const url = urlAbsoluta(rutaProducto(producto));
  const urlCategoria = urlAbsoluta(rutaCategoria(producto.categoria));
  const imagenes = producto.multimedia.filter((medio) => medio.tipo !== 'video').map((medio) => medio.url);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: producto.nombre,
        description: producto.descripcion,
        sku: producto.id,
        category: nombreCategoria,
        url,
        ...(imagenes.length > 0 && { image: imagenes }),
        offers: {
          '@type': 'Offer',
          url,
          price: producto.precio,
          priceCurrency: 'COP',
          availability: producto.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: { '@id': `${urlAbsoluta('/')}#tienda` },
        },
        ...(producto.enlaceCompra &&
          producto.stock > 0 && {
            potentialAction: {
              '@type': 'BuyAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: producto.enlaceCompra,
                actionPlatform: ['https://schema.org/DesktopWebPlatform', 'https://schema.org/MobileWebPlatform'],
              },
            },
          }),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Catálogo', item: urlAbsoluta('/') },
          { '@type': 'ListItem', position: 2, name: nombreCategoria, item: urlCategoria },
          { '@type': 'ListItem', position: 3, name: producto.nombre, item: url },
        ],
      },
    ],
  };
}

// Nombre "bonito" de la categoría: si conviven "Jugueteria" y "Juguetería", gana la de tilde.
function nombreCategoria(productos, producto) {
  const misma = rutaCategoria(producto.categoria);
  const variantes = productos.filter((p) => p.activo && rutaCategoria(p.categoria) === misma).map((p) => p.categoria);
  return variantes.find((nombre) => /[^\u0000-\u007f]/.test(nombre)) ?? producto.categoria;
}

export default function PaginaProducto({ id: slug }) {
  const { productos } = useProductos();
  const { esAdmin } = useAuth();
  const manejarCompra = useComprar();

  const producto = buscarProductoPorSlug(productos, slug);
  // Solo se muestra si existe y está activo (o si quien mira es admin).
  const visible = Boolean(producto && (producto.activo || esAdmin));
  const ruta = visible ? rutaProducto(producto) : null;
  const primeraImagen = visible ? producto.multimedia.find((medio) => medio.tipo !== 'video') : null;
  const categoria = visible ? nombreCategoria(productos, producto) : '';

  useMetaPagina(
    visible
      ? {
          titulo: producto.nombre,
          descripcion: recortar(`${producto.descripcion} Precio: ${formatoCop(producto.precio)} COP.`),
          ruta,
          imagen: primeraImagen?.url,
          // Un producto inactivo (solo lo ve el admin) no debe salir en Google.
          noindex: !producto.activo,
          schema: schemaProducto(producto, categoria),
        }
      : { titulo: 'Producto no disponible', noindex: true }
  );

  // Si se entró con un slug antiguo (otro nombre o solo el ID), la URL se corrige a la actual.
  useEffect(() => {
    if (ruta && window.location.pathname !== ruta) reemplazarRuta(ruta);
  }, [ruta, slug]);

  if (!visible) {
    return (
      <section className="contenedor vacio">
        <h1 className="vacio__titulo">Producto no disponible</h1>
        <p>El producto que buscas no existe o ya no está disponible.</p>
        <a className="boton boton--primario" href="/">
          Volver al catálogo
        </a>
      </section>
    );
  }

  const agotado = producto.stock <= 0;

  return (
    <article className="producto contenedor">
      <nav className="migas" aria-label="Ruta de navegación">
        <a href="/">Catálogo</a>
        <span aria-hidden="true"> / </span>
        <a href={rutaCategoria(producto.categoria)}>{categoria}</a>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{producto.nombre}</span>
      </nav>

      <div className="producto__rejilla">
        <Carrusel key={producto.id} multimedia={producto.multimedia} nombre={producto.nombre} />

        <div className="producto__info">
          <p className="producto__etiquetas">
            <span className="insignia insignia--id">ID: {producto.id}</span>
            <span className="insignia insignia--categoria">{categoria}</span>
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
            <a className="boton boton--secundario boton--grande" href="/">
              ← Volver al catálogo
            </a>
          </div>

          {/* Datos clave en formato tabla: fáciles de leer para personas, Google y asistentes de IA.
              Solo hechos que la tienda garantiza (ver Términos y Condiciones). */}
          <section aria-labelledby="titulo-ficha">
            <h2 id="titulo-ficha" className="producto__subtitulo">
              Datos del producto
            </h2>
            <dl className="producto__ficha">
              <div>
                <dt>Referencia</dt>
                <dd>{producto.id}</dd>
              </div>
              <div>
                <dt>Categoría</dt>
                <dd>
                  <a href={rutaCategoria(producto.categoria)}>{categoria}</a>
                </dd>
              </div>
              <div>
                <dt>Precio</dt>
                <dd>{formatoCop(producto.precio)} COP</dd>
              </div>
              <div>
                <dt>Disponibilidad</dt>
                <dd>{agotado ? 'Agotado' : `${producto.stock} unidades`}</dd>
              </div>
              <div>
                <dt>Envío</dt>
                <dd>A toda Colombia. El costo se informa antes de pagar.</dd>
              </div>
              <div>
                <dt>Cómo comprar</dt>
                <dd>Con el botón «Comprar», por WhatsApp.</dd>
              </div>
              <div>
                <dt>Devoluciones</dt>
                <dd>
                  5 días hábiles después de recibirlo (<a href="/terminos">derecho de retracto</a>).
                </dd>
              </div>
              <div>
                <dt>Actualizado</dt>
                <dd>
                  <time dateTime={producto.fechaCreacion}>{formatoFecha(producto.fechaCreacion)}</time>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </article>
  );
}
