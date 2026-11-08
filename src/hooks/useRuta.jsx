// ============================================================
// useRuta.jsx
// Mini-router propio (sin react-router).
//
// - Páginas públicas: URL real ("/", "/sobre-nosotros", "/producto/<slug>",
//   "/categoria/<slug>", "/privacidad"...). Google puede rastrearlas e indexarlas.
// - Login y Admin: van cifrados en el hash ("/#/k9Fz3x...", ver
//   src/utils/rutasCifradas.js). Escritos en claro ("/login") no existen.
// - Los enlaces cifrados antiguos de páginas públicas (de cuando toda la web
//   iba cifrada) se convierten solos en su URL real.
//
// Los <a href="/..."> internos se interceptan para cambiar de página sin
// recargar (history.pushState). Cloudflare sirve index.html para cualquier
// ruta (not_found_handling en wrangler.jsonc), así que recargar también funciona.
// ============================================================

import { useEffect, useState } from 'react';
import { RUTAS_PRIVADAS, descifrarRuta, enlaceInterno } from '../utils/rutasCifradas';

// Páginas públicas con URL propia.
const PAGINAS = ['sobre-nosotros', 'privacidad', 'terminos', 'cookies'];

// Secciones ocultas: no se pueden abrir de ninguna forma. Si alguien lo intenta, va al catálogo.
const RUTAS_OCULTAS = ['contacto'];

// Aviso interno para que el hook relea la ruta tras un pushState (que no dispara eventos).
const EVENTO_NAVEGAR = 'altair:navegar';

// Convierte una ruta en claro ("/producto/abc") en { nombre, parametro }.
function interpretarRuta(ruta) {
  const partes = ruta.split('/').filter(Boolean);

  if (partes.length === 0) return { nombre: 'inicio', parametro: null };
  if ((partes[0] === 'producto' || partes[0] === 'categoria') && partes.length === 2) {
    return { nombre: partes[0], parametro: decodeURIComponent(partes[1]) };
  }
  if (partes.length === 1) return { nombre: partes[0], parametro: null };
  return { nombre: 'no-encontrada', parametro: null };
}

// Lee la URL actual y decide qué página mostrar.
function leerRuta() {
  const { pathname, search, hash } = window.location;

  // 1) ¿Hay un enlace cifrado en el hash? (login, admin o un enlace antiguo)
  const token = hash.replace(/^#\/?/, '');
  const rutaCifrada = token ? descifrarRuta(token) : null;

  if (rutaCifrada !== null) {
    if (RUTAS_PRIVADAS.includes(rutaCifrada)) return interpretarRuta(rutaCifrada);

    // Enlace cifrado antiguo de una página pública: se cambia por su URL real
    // (sin dejar rastro en el historial).
    const destino = RUTAS_OCULTAS.includes(interpretarRuta(rutaCifrada).nombre) ? '/' : rutaCifrada;
    window.history.replaceState(null, '', destino);
    return interpretarRuta(destino);
  }

  // 2) URL normal.
  const ruta = interpretarRuta(pathname);

  if (RUTAS_OCULTAS.includes(ruta.nombre)) {
    window.history.replaceState(null, '', `/${search}`);
    return { nombre: 'inicio', parametro: null };
  }

  const conocida = ['inicio', 'producto', 'categoria'].includes(ruta.nombre) || PAGINAS.includes(ruta.nombre);
  // "/login" o "/admin" escritos en claro caen aquí: para el público no existen.
  return conocida ? ruta : { nombre: 'no-encontrada', parametro: null };
}

function avisarCambio() {
  window.dispatchEvent(new Event(EVENTO_NAVEGAR));
}

// Cambia de página desde el código (equivale a pulsar un enlace).
// Recibe la ruta en claro, por ejemplo irA('/login'); si es privada se cifra sola.
export function irA(ruta) {
  window.history.pushState(null, '', enlaceInterno(ruta));
  avisarCambio();
}

// Cambia la URL sin crear una entrada nueva en el historial ni volver arriba.
// Lo usa la ficha de producto para corregir un slug antiguo.
export function reemplazarRuta(ruta) {
  window.history.replaceState(null, '', ruta);
}

// Clics en enlaces internos: se navega sin recargar la página.
function alHacerClic(evento) {
  // Respeta lo que ya gestionó React (p. ej. "Saltar al contenido") y las
  // combinaciones para abrir en otra pestaña (Ctrl, Cmd, Shift, rueda del ratón).
  if (evento.defaultPrevented || evento.button !== 0) return;
  if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;

  const enlace = evento.target instanceof Element ? evento.target.closest('a[href]') : null;
  if (!enlace || enlace.hasAttribute('download')) return;
  if (enlace.target && enlace.target !== '_self') return;

  const url = new URL(enlace.href);
  if (url.origin !== window.location.origin) return; // externos, mailto:, tel:

  evento.preventDefault();
  const destino = `${url.pathname}${url.search}${url.hash}`;
  const actual = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (destino !== actual) window.history.pushState(null, '', destino);
  avisarCambio();
}

// Hook: devuelve la ruta actual y se actualiza al navegar.
export function useRuta() {
  const [ruta, setRuta] = useState(leerRuta);

  useEffect(() => {
    function alCambiarRuta() {
      setRuta(leerRuta());
      window.scrollTo(0, 0); // Cada página nueva empieza arriba.
    }
    window.addEventListener(EVENTO_NAVEGAR, alCambiarRuta);
    window.addEventListener('popstate', alCambiarRuta); // botones Atrás / Adelante
    window.addEventListener('hashchange', alCambiarRuta); // enlace cifrado pegado a mano
    document.addEventListener('click', alHacerClic);
    return () => {
      window.removeEventListener(EVENTO_NAVEGAR, alCambiarRuta);
      window.removeEventListener('popstate', alCambiarRuta);
      window.removeEventListener('hashchange', alCambiarRuta);
      document.removeEventListener('click', alHacerClic);
    };
  }, []);

  return ruta;
}
