// ============================================================
// prerender.jsx
// Pinta en el build (no en el navegador) las páginas públicas con los
// componentes reales y los datos de Supabase, para que el HTML de cada URL
// ya traiga su H1, textos, enlaces e imágenes. Así lo leen también los
// buscadores y herramientas que no ejecutan JavaScript.
//
// Vite lo compila para Node ("vite build --ssr") y lo usa
// scripts/prerender.mjs, que escribe los archivos en dist/.
// Nunca se carga en el navegador.
// ============================================================

import { renderToStaticMarkup } from 'react-dom/server';
import { Estructura } from './App';
import { AuthContext } from './context/AuthContext';
import { AvisosContext } from './context/AvisosContext';
import { ConfigContext } from './context/ConfigContext';
import { ProductosContext } from './context/ProductosContext';
import { categoriaIndexable } from './data/categorias';
import { PAGINAS_PUBLICAS } from './data/seo';
import { metaPrerender } from './hooks/useMetaPagina';
import { obtenerConfig } from './services/configService';
import { obtenerProductos } from './services/productosService';
import { agruparCategorias, rutaCategoria } from './utils/categorias';
import { rutaProducto } from './utils/slug';

const nada = () => {};
const sinServidor = async () => ({ ok: false, error: 'No disponible durante el prerenderizado.' });

// Lo mismo que descarga un visitante sin sesión (RLS: solo productos activos).
export async function cargarDatos() {
  const [catalogo, contacto] = await Promise.all([obtenerProductos(), obtenerConfig()]);
  if (!catalogo.ok) throw new Error(catalogo.error);
  if (!contacto.ok) throw new Error(contacto.error);
  return { productos: catalogo.productos, config: contacto.config };
}

// Las mismas URLs que el sitemap: páginas fijas, categorías indexables y productos activos.
// Devuelve [{ url, ruta }], donde "ruta" es lo que entendería useRuta en el navegador.
export function rutasPublicas(productos) {
  const activos = productos.filter((p) => p.activo);
  const fijas = PAGINAS_PUBLICAS.map((url) => ({
    url,
    ruta: url === '/' ? { nombre: 'inicio', parametro: null } : { nombre: url.slice(1), parametro: null },
  }));
  const categorias = agruparCategorias(activos)
    .filter(categoriaIndexable)
    .map((categoria) => ({ url: rutaCategoria(categoria.slug), ruta: { nombre: 'categoria', parametro: categoria.slug } }));
  const fichas = activos.map((producto) => {
    const url = rutaProducto(producto);
    return { url, ruta: { nombre: 'producto', parametro: url.split('/')[2] } };
  });
  return [...fijas, ...categorias, ...fichas];
}

// Devuelve { html, meta }: el contenido de #root y las etiquetas del <head> de esa página.
export function renderizar(ruta, { productos, config }) {
  metaPrerender.actual = null;
  const html = renderToStaticMarkup(
    <AvisosContext.Provider value={{ avisos: [], mostrarAviso: nada, cerrarAviso: nada }}>
      <AuthContext.Provider value={{ usuario: null, esAdmin: false, cargando: false, entrar: sinServidor, salir: nada }}>
        <ConfigContext.Provider value={{ config, cargando: false, listo: true, error: '', recargar: nada, actualizarConfig: sinServidor }}>
          <ProductosContext.Provider
            value={{ productos, ventas: {}, ventasProducto: {}, categoriasExtra: [], cargando: false, listo: true, error: '', comprar: sinServidor }}
          >
            <Estructura ruta={ruta} />
          </ProductosContext.Provider>
        </ConfigContext.Provider>
      </AuthContext.Provider>
    </AvisosContext.Provider>
  );
  return { html, meta: metaPrerender.actual };
}
