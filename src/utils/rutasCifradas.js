// ============================================================
// rutasCifradas.js
// Ofuscación de las rutas internas (por ejemplo "/producto/ALT-102")
// para que la URL no muestre el destino a simple vista.
//
// Método: texto -> bytes UTF-8 -> XOR con una clave -> Base64 "seguro para URL".
// Usa solo APIs nativas del navegador (sin dependencias externas).
//
// IMPORTANTE: la clave está en el código del frontend, así que esto es una
// ofuscación y NO una seguridad real. Cualquiera puede descifrar la ruta.
// ============================================================

// Clave secreta de ofuscación. Cambiarla invalida los enlaces ya generados.
const CLAVE = 'AltairTrends-rutas';

// Ruta de inicio: se mantiene sin cifrar para que la URL sea simplemente "#/".
const RUTA_INICIO = '/';

// Aplica XOR a cada byte del texto con la clave, repitiéndola cuando se acaba.
// Como XOR es reversible, la misma función sirve para cifrar y descifrar.
function aplicarXor(bytes) {
  const bytesClave = new TextEncoder().encode(CLAVE);
  return bytes.map((byte, indice) => byte ^ bytesClave[indice % bytesClave.length]);
}

// Convierte bytes a Base64 "seguro para URL": cambia "+" por "-", "/" por "_"
// y quita el relleno "=" para que el texto no tenga caracteres especiales.
function bytesABase64Url(bytes) {
  const textoBinario = String.fromCharCode(...bytes);
  return btoa(textoBinario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Hace lo contrario: vuelve del Base64 seguro para URL a bytes.
function base64UrlABytes(token) {
  // Devuelve los caracteres originales de Base64 y restaura el relleno "=".
  const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
  const relleno = '='.repeat((4 - (base64.length % 4)) % 4);
  const textoBinario = atob(base64 + relleno);
  return Uint8Array.from(textoBinario, (caracter) => caracter.charCodeAt(0));
}

// Cifra una ruta. Ejemplo: cifrarRuta('/contacto') -> 'un-texto-raro'.
export function cifrarRuta(ruta) {
  if (ruta === RUTA_INICIO) return '';

  const bytes = new TextEncoder().encode(ruta);
  return bytesABase64Url(aplicarXor(bytes));
}

// Descifra un token. Devuelve la ruta original, o null si el token no es válido.
// Ejemplo: descifrarRuta('un-texto-raro') -> '/contacto'.
export function descifrarRuta(token) {
  // Un token vacío corresponde a la ruta de inicio.
  if (token === '') return RUTA_INICIO;

  // Solo pueden existir letras, números, "-" y "_". Cualquier otro carácter
  // (por ejemplo "/" de una URL sin cifrar como "#/contacto") no es un token válido.
  if (!/^[A-Za-z0-9_-]+$/.test(token)) return null;

  try {
    const bytes = aplicarXor(base64UrlABytes(token));
    const ruta = new TextDecoder('utf-8', { fatal: true }).decode(bytes);

    // Solo aceptamos resultados que parezcan una ruta. Si no, el token es basura.
    return ruta.startsWith('/') ? ruta : null;
  } catch {
    // atob o TextDecoder lanzan error si el texto no es válido.
    return null;
  }
}

// Devuelve el enlace (href) listo para usar en un <a>, por ejemplo "#/un-texto-raro".
export function enlaceInterno(ruta) {
  return `#/${cifrarRuta(ruta)}`;
}
