// ============================================================
// generar-sitemap.mjs
// Crea dist/sitemap.xml al final de "npm run build" con:
//   - las páginas públicas fijas (catálogo, sobre nosotros, legales),
//   - una URL por cada categoría indexable (ver src/data/categorias.js),
//   - una URL por cada producto ACTIVO, leído de Supabase.
//
// Como se genera al desplegar, un producto nuevo entra en el sitemap en el
// siguiente despliegue (push a main o "Retry deployment" en Cloudflare).
// Si Supabase no responde, se genera solo con las páginas fijas y el
// build sigue adelante (nunca rompe el despliegue).
// ============================================================

import { writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';
import { categoriaIndexable } from '../src/data/categorias.js';
import { PAGINAS_PUBLICAS, SITIO } from '../src/data/seo.js';
import { agruparCategorias, rutaCategoria } from '../src/utils/categorias.js';
import { rutaProducto } from '../src/utils/slug.js';

const DESTINO = 'dist/sitemap.xml';

// Lee VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY del .env (local)
// o de las variables de build (Cloudflare).
const entorno = loadEnv('production', process.cwd(), 'VITE_');

async function leerProductosActivos() {
  if (!entorno.VITE_SUPABASE_URL || !entorno.VITE_SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY');
  }
  const supabase = createClient(entorno.VITE_SUPABASE_URL, entorno.VITE_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
  });
  const { data, error } = await supabase.from('productos').select('id, nombre, categoria, fecha_creacion').eq('activo', true);
  if (error) throw new Error(error.message);
  return data;
}

function entrada(ruta, fecha) {
  const lastmod = fecha ? `\n    <lastmod>${new Date(fecha).toISOString().slice(0, 10)}</lastmod>` : '';
  return `  <url>\n    <loc>${new URL(ruta, SITIO.url).href}</loc>${lastmod}\n  </url>`;
}

let productos = [];
try {
  productos = await leerProductosActivos();
} catch (error) {
  console.warn(`[sitemap] No se pudieron leer los productos (${error.message}). Solo se incluyen las páginas fijas.`);
}

const categorias = agruparCategorias(productos).filter(categoriaIndexable);
// La portada cambia cada vez que se añade o modifica un producto.
const ultimaModificacion = productos.reduce((ultima, p) => (p.fecha_creacion > ultima ? p.fecha_creacion : ultima), '');

const urls = [
  ...PAGINAS_PUBLICAS.map((ruta) => entrada(ruta, ruta === '/' ? ultimaModificacion : null)),
  ...categorias.map((categoria) => entrada(rutaCategoria(categoria.slug), categoria.actualizado)),
  ...productos.map((producto) => entrada(rutaProducto(producto), producto.fecha_creacion)),
];

writeFileSync(
  DESTINO,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
);
console.log(
  `[sitemap] ${DESTINO}: ${PAGINAS_PUBLICAS.length} páginas fijas + ${categorias.length} categorías + ${productos.length} productos.`
);
