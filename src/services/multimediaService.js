// ============================================================
// multimediaService.js
// Imágenes y videos de los productos en Supabase Storage.
//
// Cómo funciona:
//   - En el formulario, un archivo elegido desde el equipo queda "pendiente":
//     { tipo, url: <vista previa local>, archivo: <Blob/File> }.
//   - Al guardar el producto, subirPendientes() sube esos archivos al bucket
//     "productos" y los cambia por { tipo, url: <URL pública> }.
//   - En la tabla "productos" solo se guarda la lista de URLs, nunca el archivo.
//   - Al borrar un producto o quitarle multimedia, se borran sus archivos
//     del bucket para no dejar basura.
// ============================================================

import { supabase } from './supabaseCliente';

// Nombre del bucket creado en la migración.
const BUCKET = 'productos';

// Tamaño máximo por archivo (igual que el límite del bucket): 20 MB.
export const TAMANO_MAXIMO = 20 * 1024 * 1024;

// Formatos permitidos (igual que en el bucket) y su extensión de archivo.
const EXTENSIONES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

// Indica si un tipo de archivo (MIME) está permitido.
export function formatoPermitido(tipoMime) {
  return Object.prototype.hasOwnProperty.call(EXTENSIONES, tipoMime);
}

// Comienzo de las URLs públicas de nuestro bucket. Sirve para reconocer
// qué URLs son archivos nuestros (y se pueden borrar) y cuáles son enlaces externos.
function prefijoPublico() {
  return supabase.storage.from(BUCKET).getPublicUrl('').data.publicUrl;
}

// Convierte una URL pública de nuestro bucket en la ruta del archivo dentro del bucket.
// Devuelve null si la URL es un enlace externo.
function rutaDesdeUrl(url) {
  const prefijo = prefijoPublico();
  if (!String(url).startsWith(prefijo)) return null;
  return decodeURIComponent(String(url).slice(prefijo.length));
}

// Sube un único archivo y devuelve su URL pública.
async function subirArchivo(archivo) {
  if (!formatoPermitido(archivo.type)) {
    return { ok: false, error: 'Formato no permitido. Usa JPG, PNG, WEBP, GIF, MP4 o WEBM.' };
  }
  if (archivo.size > TAMANO_MAXIMO) {
    return { ok: false, error: 'Cada archivo puede pesar como máximo 20 MB.' };
  }

  // Nombre aleatorio: evita choques y no expone el nombre original del archivo.
  const ruta = `${crypto.randomUUID()}.${EXTENSIONES[archivo.type]}`;
  const { error } = await supabase.storage.from(BUCKET).upload(ruta, archivo, {
    contentType: archivo.type,
    cacheControl: '31536000', // Un año: el archivo nunca cambia (cada subida tiene nombre nuevo).
    upsert: false,
  });

  if (error) return { ok: false, error: 'No se pudo subir uno de los archivos. Inténtalo de nuevo.' };
  return { ok: true, url: supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl };
}

// Sube todos los archivos pendientes de una lista de multimedia.
// Devuelve la lista final (solo { tipo, url }) y las URLs recién subidas,
// para poder borrarlas si después falla el guardado del producto.
export async function subirPendientes(multimedia) {
  const final = [];
  const subidas = [];

  for (const medio of multimedia) {
    // Enlaces normales (o archivos ya subidos antes): se conservan tal cual.
    if (!medio.archivo) {
      final.push({ tipo: medio.tipo, url: medio.url });
      continue;
    }

    const resultado = await subirArchivo(medio.archivo);
    if (!resultado.ok) {
      // Si uno falla, se deshacen las subidas de esta tanda.
      await borrarArchivos(subidas);
      return { ok: false, error: resultado.error };
    }
    subidas.push(resultado.url);
    final.push({ tipo: medio.tipo, url: resultado.url });
  }

  return { ok: true, multimedia: final, subidas };
}

// Borra del bucket los archivos de una lista de URLs. Ignora los enlaces externos.
// Si falla no se interrumpe nada: como mucho queda un archivo sin usar en el bucket.
export async function borrarArchivos(urls) {
  const rutas = urls.map(rutaDesdeUrl).filter((ruta) => ruta !== null);
  if (rutas.length === 0) return;
  await supabase.storage.from(BUCKET).remove(rutas);
}

// URLs que estaban en "antes" y ya no están en "despues" (multimedia que se quitó).
export function urlsQuitadas(antes, despues) {
  const actuales = new Set(despues.map((medio) => medio.url));
  return antes.map((medio) => medio.url).filter((url) => !actuales.has(url));
}
