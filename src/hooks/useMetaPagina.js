// ============================================================
// useMetaPagina.js
// Cambia, para cada página, lo que leen Google y las redes sociales:
//   <title>, meta description, enlace canónico, robots (noindex),
//   Open Graph / Twitter y datos estructurados (JSON-LD de schema.org).
// index.html trae los valores por defecto; este hook los sobrescribe
// cuando React pinta la página.
//
// Uso:
//   useMetaPagina({ titulo: 'Sobre nosotros', descripcion: '...', ruta: '/sobre-nosotros' });
//   useMetaPagina({ titulo: 'Iniciar sesión', noindex: true });
// ============================================================

import { useEffect } from 'react';
import { SITIO } from '../data/seo';

const ID_SCHEMA = 'schema-pagina';

// Crea, actualiza o quita una etiqueta <meta>. atributo es "name" o "property".
function ponerMeta(atributo, clave, valor) {
  let etiqueta = document.head.querySelector(`meta[${atributo}="${clave}"]`);
  if (!valor) {
    etiqueta?.remove();
    return;
  }
  if (!etiqueta) {
    etiqueta = document.createElement('meta');
    etiqueta.setAttribute(atributo, clave);
    document.head.appendChild(etiqueta);
  }
  etiqueta.setAttribute('content', valor);
}

function ponerCanonico(url) {
  let enlace = document.head.querySelector('link[rel="canonical"]');
  if (!url) {
    enlace?.remove();
    return;
  }
  if (!enlace) {
    enlace = document.createElement('link');
    enlace.setAttribute('rel', 'canonical');
    document.head.appendChild(enlace);
  }
  enlace.setAttribute('href', url);
}

// JSON-LD propio de la página (el de la tienda en general está fijo en index.html).
// Es un bloque de datos, no código: la CSP no lo bloquea.
function ponerSchema(texto) {
  let bloque = document.getElementById(ID_SCHEMA);
  if (!texto) {
    bloque?.remove();
    return;
  }
  if (!bloque) {
    bloque = document.createElement('script');
    bloque.type = 'application/ld+json';
    bloque.id = ID_SCHEMA;
    document.head.appendChild(bloque);
  }
  bloque.textContent = texto;
}

// Convierte "/og.jpg" en "https://altairtrends.com/og.jpg"; deja igual las URLs completas.
export function urlAbsoluta(ruta) {
  return new URL(ruta, SITIO.url).href;
}

// Acorta un texto para la meta description (Google muestra unos 155-160 caracteres).
export function recortar(texto, maximo = 155) {
  const limpio = String(texto ?? '').replace(/\s+/g, ' ').trim();
  if (limpio.length <= maximo) return limpio;
  const corte = limpio.lastIndexOf(' ', maximo - 1); // corta en un espacio, no a mitad de palabra
  return `${limpio.slice(0, corte > 0 ? corte : maximo - 1).replace(/[,.;:]$/, '')}…`;
}

// Valores finales de las etiquetas de una página.
export function calcularMeta({ titulo, descripcion, ruta, imagen, noindex = false, schema = null }) {
  return {
    tituloCompleto: titulo ? `${titulo} | ${SITIO.nombre}` : SITIO.titulo,
    textoDescripcion: descripcion || SITIO.descripcion,
    // Las páginas noindex no llevan canónico: no deben aparecer en Google.
    canonico: !noindex && ruta ? urlAbsoluta(ruta) : null,
    urlImagen: urlAbsoluta(imagen || SITIO.imagen),
    noindex,
    // El schema se pasa a texto para que el efecto solo se repita si su contenido cambia.
    schemaTexto: schema && !noindex ? JSON.stringify(schema) : null,
  };
}

// Durante el prerenderizado del build (src/prerender.jsx) no hay navegador ni
// efectos: la última página pintada deja aquí sus etiquetas para escribirlas en el HTML.
export const metaPrerender = { actual: null };

export function useMetaPagina(opciones) {
  const meta = calcularMeta(opciones);
  if (typeof document === 'undefined') metaPrerender.actual = meta;
  const { tituloCompleto, textoDescripcion, canonico, urlImagen, noindex, schemaTexto } = meta;

  useEffect(() => {
    document.title = tituloCompleto;
    ponerMeta('name', 'description', textoDescripcion);
    ponerMeta('name', 'robots', noindex ? 'noindex, nofollow' : null);
    ponerCanonico(canonico);

    ponerMeta('property', 'og:title', tituloCompleto);
    ponerMeta('property', 'og:description', textoDescripcion);
    ponerMeta('property', 'og:url', canonico);
    ponerMeta('property', 'og:image', urlImagen);
    ponerMeta('name', 'twitter:title', tituloCompleto);
    ponerMeta('name', 'twitter:description', textoDescripcion);
    ponerMeta('name', 'twitter:image', urlImagen);

    ponerSchema(schemaTexto);
  }, [tituloCompleto, textoDescripcion, canonico, urlImagen, noindex, schemaTexto]);
}
