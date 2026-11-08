// ============================================================
// PaginaCatalogo.jsx
// Catálogo con filtros. Solo muestra productos con estado Activo.
//
// Dos modos (mismo componente):
//   - Portada "/": todos los productos.
//   - Categoría "/categoria/<slug>": solo esa categoría, con su propio título,
//     texto, URL canónica y migas. Los chips de categoría son enlaces reales
//     para que Google pueda recorrer y posicionar cada categoría.
//
// "/?q=texto" abre el catálogo con el buscador relleno (lo declara el
// SearchAction de index.html para buscadores y agentes de IA).
// ============================================================

import { useState } from 'react';
import FiltrosUsuario from '../components/catalogo/FiltrosUsuario';
import TarjetaProducto from '../components/catalogo/TarjetaProducto';
import { useProductos } from '../context/ProductosContext';
import { categoriaIndexable, textosCategoria } from '../data/categorias';
import { urlAbsoluta, useMetaPagina } from '../hooks/useMetaPagina';
import { irA } from '../hooks/useRuta';
import { agruparCategorias, rutaCategoria } from '../utils/categorias';
import { FILTROS_INICIALES, filtrarProductos } from '../utils/filtrarProductos';
import { formatoFecha } from '../utils/formatos';
import { rutaProducto, slugificar } from '../utils/slug';

// Filtros iniciales con el texto de "?q=" si viene en la URL.
function filtrosDesdeUrl() {
  const busqueda = new URLSearchParams(window.location.search).get('q') ?? '';
  return { ...FILTROS_INICIALES, nombre: busqueda.slice(0, 100) };
}

function listaSchema(productos) {
  return {
    '@type': 'ItemList',
    numberOfItems: productos.length,
    itemListElement: productos.map((producto, posicion) => ({
      '@type': 'ListItem',
      position: posicion + 1,
      url: urlAbsoluta(rutaProducto(producto)),
      name: producto.nombre,
    })),
  };
}

export default function PaginaCatalogo({ categoria = null }) {
  const { productos } = useProductos();
  const [filtros, setFiltros] = useState(filtrosDesdeUrl);

  // Solo los productos activos son visibles para el usuario.
  const activos = productos.filter((p) => p.activo);
  const categorias = agruparCategorias(activos);
  const actual = categoria ? categorias.find((c) => c.slug === slugificar(categoria)) : null;
  const categoriaInexistente = Boolean(categoria) && !actual;

  const base = actual ? activos.filter((p) => slugificar(p.categoria) === actual.slug) : activos;
  const visibles = filtrarProductos(base, filtros, true);
  const unidadesTotales = base.reduce((suma, p) => suma + p.stock, 0);
  // Fecha de la última alta o modificación (frescura del dato, visible para personas y buscadores).
  const actualizado = base.reduce((ultima, p) => (p.fechaCreacion > ultima ? p.fechaCreacion : ultima), '');
  const textos = actual ? textosCategoria(actual) : null;

  useMetaPagina(
    categoriaInexistente
      ? { titulo: 'Categoría no disponible', noindex: true }
      : actual
        ? {
            titulo: textos.titulo,
            descripcion: textos.descripcion,
            ruta: rutaCategoria(actual.slug),
            noindex: !categoriaIndexable(actual),
            schema: {
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'CollectionPage',
                  name: textos.titulo,
                  description: textos.descripcion,
                  url: urlAbsoluta(rutaCategoria(actual.slug)),
                  mainEntity: listaSchema(base),
                },
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Catálogo', item: urlAbsoluta('/') },
                    { '@type': 'ListItem', position: 2, name: actual.nombre, item: urlAbsoluta(rutaCategoria(actual.slug)) },
                  ],
                },
              ],
            },
          }
        : // Portada: título y descripción por defecto (los de SITIO) + la lista de productos.
          { ruta: '/', schema: { '@context': 'https://schema.org', name: 'Catálogo AltairTrends', ...listaSchema(activos) } }
  );

  // "Limpiar filtros" en una categoría también vuelve a "Todas".
  function limpiar() {
    setFiltros(FILTROS_INICIALES);
    if (categoria) irA('/');
  }

  if (categoriaInexistente) {
    return (
      <section className="contenedor vacio">
        <h1 className="vacio__titulo">Categoría no disponible</h1>
        <p>Esta categoría no existe o ya no tiene productos disponibles.</p>
        <a className="boton boton--primario" href="/">
          Ver todo el catálogo
        </a>
      </section>
    );
  }

  return (
    <>
      <section className="catalogo contenedor" aria-labelledby="titulo-catalogo">
        {actual && (
          <nav className="migas" aria-label="Ruta de navegación">
            <a href="/">Catálogo</a>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{actual.nombre}</span>
          </nav>
        )}

        <header className="catalogo__cabecera">
          <div>
            {/* Es el encabezado principal (h1) de la página, ya que no hay portada.
                La insignia va fuera del h1 para que el título quede limpio para Google. */}
            <div className="catalogo__titulo-fila">
              <h1 id="titulo-catalogo" className="titulo-seccion">
                {actual ? textos.titulo : 'Catálogo Exclusivo'}
              </h1>
              <span className="insignia insignia--exito">Solo productos disponibles</span>
            </div>
            <p className="catalogo__subtitulo">
              {actual
                ? `${textos.intro} Precios en pesos colombianos (COP) y envío a toda Colombia.`
                : 'Explora productos seleccionados para el hogar, juguetes, belleza y tecnología en inventario inmediato, con precios en pesos colombianos (COP) y envío a toda Colombia.'}
            </p>
            {actualizado && (
              <p className="catalogo__actualizado">
                Precios y disponibilidad actualizados el <time dateTime={actualizado}>{formatoFecha(actualizado)}</time>
              </p>
            )}
          </div>
          <p className="catalogo__total">
            Total unidades: <strong>{unidadesTotales} uds</strong>
          </p>
        </header>

        <FiltrosUsuario
          filtros={filtros}
          onCambiar={setFiltros}
          categorias={categorias}
          categoriaActual={actual?.slug ?? null}
          onLimpiar={limpiar}
        />

        <p className="catalogo__resultados" aria-live="polite">
          Mostrando {visibles.length} de {base.length} productos
        </p>

        {/* h2 solo para lectores de pantalla y buscadores: evita saltar del h1 al h3 de las tarjetas */}
        <h2 className="sr-solo">Productos</h2>

        {visibles.length > 0 ? (
          <ul className="catalogo__rejilla">
            {visibles.map((producto) => (
              <li key={producto.id}>
                <TarjetaProducto producto={producto} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="vacio">
            <p className="vacio__titulo">No encontramos productos con esos filtros.</p>
            <button type="button" className="boton boton--secundario" onClick={limpiar}>
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </>
  );
}
