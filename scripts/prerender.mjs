// ============================================================
// prerender.mjs
// Paso de "npm run build" (después de "vite build"): crea un HTML ya pintado
// para cada página pública, con su <title>, descripción, canónico, Open Graph,
// datos estructurados y el contenido visible (H1, textos, enlaces, imágenes).
//
//   /                    -> dist/index.html
//   /sobre-nosotros      -> dist/sobre-nosotros.html
//   /categoria/<slug>    -> dist/categoria/<slug>.html
//   /producto/<slug>     -> dist/producto/<slug>.html
//
// Cloudflare sirve "/categoria/hogar" desde "categoria/hogar.html" (sin
// redirigir ni añadir "/" al final). En el navegador React toma el control
// sin parpadeo (ver src/main.jsx).
//
// Las páginas se pintan con los componentes reales (src/prerender.jsx,
// compilado por "vite build --ssr"). Si Supabase no responde se deja el
// index.html normal y el build sigue adelante (igual que el sitemap).
// Como se genera al desplegar, un producto nuevo tiene su HTML en el
// siguiente despliegue; mientras tanto se ve igual, pintado por React.
// ============================================================

import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = 'dist';
const COMPILADO = 'node_modules/.cache/prerender/prerender.js';

const { cargarDatos, rutasPublicas, renderizar } = await import(pathToFileURL(COMPILADO).href);

// Escapa texto para meterlo en un atributo o entre etiquetas HTML.
function escapar(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Cambia el atributo "content" de una <meta> ya existente en la plantilla.
function cambiarMeta(html, atributo, clave, valor) {
  const patron = new RegExp(`(<meta ${atributo}="${clave}" content=")[^"]*(")`);
  if (!patron.test(html)) throw new Error(`index.html no tiene <meta ${atributo}="${clave}">`);
  return html.replace(patron, (_, antes, despues) => `${antes}${escapar(valor)}${despues}`);
}

// Rellena la plantilla (dist/index.html de Vite) con los datos de una página.
function componerPagina(plantilla, url, { html, meta }) {
  if (!meta) throw new Error(`La página ${url} no llamó a useMetaPagina`);

  let pagina = plantilla.replace(/<title>[^<]*<\/title>/, () => `<title>${escapar(meta.tituloCompleto)}</title>`);
  pagina = cambiarMeta(pagina, 'name', 'description', meta.textoDescripcion);
  pagina = cambiarMeta(pagina, 'property', 'og:title', meta.tituloCompleto);
  pagina = cambiarMeta(pagina, 'property', 'og:description', meta.textoDescripcion);
  pagina = cambiarMeta(pagina, 'property', 'og:image', meta.urlImagen);
  pagina = cambiarMeta(pagina, 'name', 'twitter:title', meta.tituloCompleto);
  pagina = cambiarMeta(pagina, 'name', 'twitter:description', meta.textoDescripcion);
  pagina = cambiarMeta(pagina, 'name', 'twitter:image', meta.urlImagen);

  if (meta.canonico) {
    pagina = pagina.replace(/(<link rel="canonical" href=")[^"]*(")/, (_, antes, despues) => `${antes}${escapar(meta.canonico)}${despues}`);
    pagina = cambiarMeta(pagina, 'property', 'og:url', meta.canonico);
  } else {
    pagina = pagina.replace(/\s*<link rel="canonical"[^>]*>/, '').replace(/\s*<meta property="og:url"[^>]*>/, '');
  }

  // Lo mismo que añade useMetaPagina en el navegador (mismo id, así no se duplica).
  const extra = [
    meta.noindex && '<meta name="robots" content="noindex, nofollow" />',
    // "<" escapado: un texto con "</script>" no puede cerrar el bloque antes de tiempo.
    meta.schemaTexto && `<script type="application/ld+json" id="schema-pagina">${meta.schemaTexto.replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean);
  if (extra.length > 0) pagina = pagina.replace('</head>', () => `    ${extra.join('\n    ')}\n  </head>`);

  // data-ruta: main.jsx comprueba que el HTML corresponde a la URL abierta.
  if (!pagina.includes('<div id="root"></div>')) throw new Error('index.html no tiene <div id="root"></div>');
  return pagina.replace('<div id="root"></div>', () => `<div id="root" data-ruta="${escapar(url)}">${html}</div>`);
}

function archivoDe(url) {
  return url === '/' ? join(DIST, 'index.html') : join(DIST, `${url.slice(1)}.html`);
}

try {
  const plantilla = readFileSync(join(DIST, 'index.html'), 'utf8');

  let datos;
  try {
    datos = await cargarDatos();
  } catch (error) {
    console.warn(`[prerender] No se pudieron leer los datos de Supabase (${error.message}). Se deja el index.html sin prerenderizar.`);
  }

  if (datos) {
    const rutas = rutasPublicas(datos.productos);
    for (const { url, ruta } of rutas) {
      const archivo = archivoDe(url);
      mkdirSync(dirname(archivo), { recursive: true });
      writeFileSync(archivo, componerPagina(plantilla, url, renderizar(ruta, datos)));
    }
    console.log(`[prerender] ${rutas.length} páginas prerenderizadas en ${DIST}/.`);
  }
} finally {
  rmSync(dirname(COMPILADO), { recursive: true, force: true });
}

// El cliente de Supabase puede dejar temporizadores abiertos: se termina aquí.
process.exit(0);
