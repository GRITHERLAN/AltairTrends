// ============================================================
// productosService.js
// BackEnd de productos sobre Supabase (tabla "productos").
//
// Validación en dos niveles, igual que antes:
//   1) Aquí (validarProducto) se repiten las reglas del formulario.
//   2) La base de datos vuelve a comprobarlas: restricciones UNIQUE para
//      ID y nombre, CHECK para precio/stock/textos, y RLS para que solo
//      el Administrador pueda escribir.
//
// Todas las funciones son asíncronas y devuelven { ok, ... } para que la
// interfaz muestre el resultado visualmente (sin alert).
// ============================================================

import { crearProductosSemilla } from '../data/productosSemilla';
import { esValorRepetido, mensajeDeError } from './erroresSupabase';
import { borrarArchivos, subirPendientes, urlsQuitadas } from './multimediaService';
import { supabase } from './supabaseCliente';

// Columnas que se piden a la tabla (en el orden de la base de datos).
const COLUMNAS = 'id, nombre, descripcion, precio, categoria, stock, multimedia, enlace_compra, activo, fecha_creacion';

// Límites de longitud: los mismos que las restricciones CHECK de la tabla.
export const LIMITES = { id: 40, nombre: 120, descripcion: 2000, categoria: 60, enlaceCompra: 2048 };

// ---------- Conversión entre la base de datos y la aplicación ----------

// La tabla usa nombres en snake_case (enlace_compra); la app, camelCase (enlaceCompra).
function filaAProducto(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    descripcion: fila.descripcion,
    precio: Number(fila.precio),
    categoria: fila.categoria,
    stock: fila.stock,
    multimedia: Array.isArray(fila.multimedia) ? fila.multimedia : [],
    enlaceCompra: fila.enlace_compra,
    activo: fila.activo,
    fechaCreacion: fila.fecha_creacion,
  };
}

// Deja el producto limpio y con los tipos correctos antes de guardarlo.
// La fecha de creación NO se envía: la pone la base de datos (automática, también al editar).
function productoAFila(datos, multimedia) {
  return {
    id: String(datos.id).trim(),
    nombre: String(datos.nombre).trim(),
    descripcion: String(datos.descripcion).trim(),
    precio: Math.round(Number(datos.precio)),
    categoria: String(datos.categoria).trim(),
    stock: Number(datos.stock),
    multimedia,
    enlace_compra: String(datos.enlaceCompra).trim(),
    activo: datos.activo !== false, // Modo estándar: activo por defecto.
  };
}

// ---------- Validaciones (las usa también el formulario) ----------

// Compara textos sin importar mayúsculas, minúsculas ni espacios sobrantes.
function normalizar(texto) {
  return String(texto).trim().toLowerCase();
}

// Comprueba que un texto sea una URL http o https válida.
export function esUrlValida(texto) {
  try {
    const url = new URL(texto);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

// Valida los datos de un producto. Devuelve un objeto con un mensaje por campo con error.
// "idOriginal" es el ID del producto que se está editando (null si se está creando),
// para que un producto no choque consigo mismo en las comprobaciones de duplicados.
export function validarProducto(datos, productos, idOriginal = null) {
  const errores = {};
  const id = String(datos.id ?? '').trim();
  const nombre = String(datos.nombre ?? '').trim();
  const descripcion = String(datos.descripcion ?? '').trim();
  const categoria = String(datos.categoria ?? '').trim();
  const enlaceCompra = String(datos.enlaceCompra ?? '').trim();

  // --- ID: obligatorio, sin espacios y único ---
  if (id === '') {
    errores.id = 'El ID es obligatorio.';
  } else if (/\s/.test(id)) {
    errores.id = 'El ID no puede contener espacios.';
  } else if (id.length > LIMITES.id) {
    errores.id = `El ID puede tener como máximo ${LIMITES.id} caracteres.`;
  } else {
    const idRepetido = productos.some(
      (p) => normalizar(p.id) === normalizar(id) && normalizar(p.id) !== normalizar(idOriginal ?? '')
    );
    if (idRepetido) errores.id = 'Ya existe un producto con este ID.';
  }

  // --- Nombre: obligatorio y único ---
  if (nombre === '') {
    errores.nombre = 'El nombre es obligatorio.';
  } else if (nombre.length > LIMITES.nombre) {
    errores.nombre = `El nombre puede tener como máximo ${LIMITES.nombre} caracteres.`;
  } else {
    const nombreRepetido = productos.some(
      (p) => normalizar(p.nombre) === normalizar(nombre) && normalizar(p.id) !== normalizar(idOriginal ?? '')
    );
    if (nombreRepetido) errores.nombre = 'Ya existe un producto con este nombre.';
  }

  // --- Descripción y categoría ---
  if (descripcion === '') errores.descripcion = 'La descripción es obligatoria.';
  else if (descripcion.length > LIMITES.descripcion) errores.descripcion = `La descripción puede tener como máximo ${LIMITES.descripcion} caracteres.`;

  if (categoria === '') errores.categoria = 'La categoría es obligatoria.';
  else if (categoria.length > LIMITES.categoria) errores.categoria = `La categoría puede tener como máximo ${LIMITES.categoria} caracteres.`;

  // --- Precio (COP): número mayor que cero ---
  const precio = Number(datos.precio);
  if (datos.precio === '' || datos.precio === null || Number.isNaN(precio) || precio <= 0) {
    errores.precio = 'Ingresa un precio mayor a 0 (en pesos colombianos).';
  }

  // --- Stock: entero igual o mayor que cero ---
  const stock = Number(datos.stock);
  if (datos.stock === '' || datos.stock === null || !Number.isInteger(stock) || stock < 0) {
    errores.stock = 'El stock debe ser un número entero igual o mayor a 0.';
  }

  // --- Enlace del botón Comprar: URL válida ---
  if (!esUrlValida(enlaceCompra) || enlaceCompra.length > LIMITES.enlaceCompra) {
    errores.enlaceCompra = 'Ingresa un enlace válido que empiece por http:// o https://.';
  }

  return errores;
}

// Convierte un error de la base de datos al guardar en errores por campo del formulario.
function erroresDeGuardado(error) {
  if (esValorRepetido(error, 'productos_nombre_unico')) return { nombre: 'Ya existe un producto con este nombre.' };
  if (esValorRepetido(error)) return { id: 'Ya existe un producto con este ID.' };
  return { general: mensajeDeError(error) };
}

// ---------- Lectura ----------

// Devuelve los productos visibles para quien consulta (RLS decide):
// los visitantes reciben solo los activos; el Administrador, todos.
export async function obtenerProductos() {
  const { data, error } = await supabase.from('productos').select(COLUMNAS).order('fecha_creacion', { ascending: false });
  if (error) return { ok: false, productos: [], error: mensajeDeError(error) };
  return { ok: true, productos: data.map(filaAProducto) };
}

// ---------- Escritura (solo Administrador) ----------

// Crea un producto nuevo. "productos" es la lista actual (para validar duplicados).
export async function crearProducto(datos, productos) {
  const errores = validarProducto(datos, productos, null);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  // 1) Sube a Storage las imágenes/videos elegidos desde el equipo.
  const subida = await subirPendientes(datos.multimedia ?? []);
  if (!subida.ok) return { ok: false, errores: { general: subida.error } };

  // 2) Guarda la fila. Si la base de datos la rechaza, se borran los archivos recién subidos.
  const { data, error } = await supabase.from('productos').insert(productoAFila(datos, subida.multimedia)).select(COLUMNAS).single();
  if (error) {
    await borrarArchivos(subida.subidas);
    return { ok: false, errores: erroresDeGuardado(error) };
  }
  return { ok: true, producto: filaAProducto(data) };
}

// Edita un producto existente (identificado por su ID original, que también se puede cambiar).
export async function actualizarProducto(idOriginal, datos, productos) {
  const anterior = productos.find((p) => p.id === idOriginal);
  if (!anterior) return { ok: false, errores: { general: 'El producto que intentas editar ya no existe.' } };

  const errores = validarProducto(datos, productos, idOriginal);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const subida = await subirPendientes(datos.multimedia ?? []);
  if (!subida.ok) return { ok: false, errores: { general: subida.error } };

  const { data, error } = await supabase
    .from('productos')
    .update(productoAFila(datos, subida.multimedia))
    .eq('id', idOriginal)
    .select(COLUMNAS)
    .maybeSingle();

  if (error || !data) {
    await borrarArchivos(subida.subidas);
    return { ok: false, errores: error ? erroresDeGuardado(error) : { general: 'El producto que intentas editar ya no existe.' } };
  }

  // 3) Se borran del bucket los archivos que el administrador quitó del producto.
  await borrarArchivos(urlsQuitadas(anterior.multimedia, subida.multimedia));
  return { ok: true, producto: filaAProducto(data) };
}

// Elimina un producto y sus archivos de Storage.
export async function eliminarProducto(producto) {
  const { error } = await supabase.from('productos').delete().eq('id', producto.id);
  if (error) return { ok: false, error: mensajeDeError(error) };

  await borrarArchivos(producto.multimedia.map((medio) => medio.url));
  return { ok: true };
}

// Alterna el estado entre activo e inactivo. La base de datos conserva la fecha de creación.
export async function cambiarEstadoProducto(producto) {
  const { data, error } = await supabase
    .from('productos')
    .update({ activo: !producto.activo })
    .eq('id', producto.id)
    .select(COLUMNAS)
    .maybeSingle();

  if (error) return { ok: false, error: mensajeDeError(error) };
  if (!data) return { ok: false, error: 'El producto ya no existe.' };
  return { ok: true, producto: filaAProducto(data) };
}

// Vuelve a cargar los 10 productos de prueba (descarta los actuales) y pone a cero
// los contadores de compras y las categorías creadas a mano. Lo hace la función
// SQL restablecer_datos() en una sola transacción: o se hace todo o nada.
export async function restablecerProductos(productosActuales) {
  const semilla = crearProductosSemilla().map((producto) => ({
    ...productoAFila(producto, producto.multimedia),
    fecha_creacion: producto.fechaCreacion, // Fechas simuladas para probar la alerta de 20 días.
  }));

  const { error } = await supabase.rpc('restablecer_datos', { p_productos: semilla });
  if (error) return { ok: false, error: mensajeDeError(error) };

  // Los archivos de los productos descartados ya no se usan: se borran del bucket.
  await borrarArchivos(productosActuales.flatMap((producto) => producto.multimedia.map((medio) => medio.url)));
  return { ok: true };
}

// ---------- Compra ----------

// Registra una compra en el servidor con la función SQL registrar_compra():
// valida que el producto exista, esté activo y tenga stock > 0, y suma 1 a los
// contadores de categoría y producto. NO modifica el stock (Comprar solo redirige).
export async function comprarProducto(id) {
  const { data, error } = await supabase.rpc('registrar_compra', { p_id: id });
  if (error) return { ok: false, error: mensajeDeError(error) };
  return data.ok ? { ok: true } : { ok: false, error: data.error };
}
