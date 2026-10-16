// ============================================================
// productosService.js
// "BackEnd" simulado de productos sobre LocalStorage.
// Aquí viven las reglas de negocio y TODAS las validaciones
// (ID único, nombre único, stock, fecha automática...), de modo
// que aunque el FrontEnd falle, los datos siempre se validan.
// Cada función devuelve un objeto { ok, ... } para que la interfaz
// pueda mostrar el resultado visualmente (sin alert).
// ============================================================

import { CLAVES, leer, escribir } from './almacenamiento';
import { crearProductosSemilla } from '../data/productosSemilla';

// Devuelve todos los productos. Si es la primera vez, siembra los de prueba.
export function obtenerProductos() {
  const guardados = leer(CLAVES.productos, null);
  if (Array.isArray(guardados)) return guardados;

  const semilla = crearProductosSemilla();
  escribir(CLAVES.productos, semilla);
  return semilla;
}

// Vuelve a cargar los 10 productos de prueba (descarta los actuales).
export function restablecerProductos() {
  const semilla = crearProductosSemilla();
  const resultado = escribir(CLAVES.productos, semilla);
  return { ok: resultado.ok, productos: semilla, error: resultado.error };
}

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

  // --- ID: obligatorio y único ---
  if (id === '') {
    errores.id = 'El ID es obligatorio.';
  } else if (/\s/.test(id)) {
    errores.id = 'El ID no puede contener espacios.';
  } else {
    const idRepetido = productos.some(
      (p) => normalizar(p.id) === normalizar(id) && normalizar(p.id) !== normalizar(idOriginal ?? '')
    );
    if (idRepetido) errores.id = 'Ya existe un producto con este ID.';
  }

  // --- Nombre: obligatorio y único ---
  if (nombre === '') {
    errores.nombre = 'El nombre es obligatorio.';
  } else {
    const nombreRepetido = productos.some(
      (p) => normalizar(p.nombre) === normalizar(nombre) && normalizar(p.id) !== normalizar(idOriginal ?? '')
    );
    if (nombreRepetido) errores.nombre = 'Ya existe un producto con este nombre.';
  }

  // --- Descripción y categoría ---
  if (String(datos.descripcion ?? '').trim() === '') errores.descripcion = 'La descripción es obligatoria.';
  if (String(datos.categoria ?? '').trim() === '') errores.categoria = 'La categoría es obligatoria.';

  // --- Precio (COP): número entero mayor que cero ---
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
  if (!esUrlValida(String(datos.enlaceCompra ?? '').trim())) {
    errores.enlaceCompra = 'Ingresa un enlace válido que empiece por http:// o https://.';
  }

  return errores;
}

// Deja el producto limpio y con los tipos correctos antes de guardarlo.
// La fecha de creación SIEMPRE se genera aquí (automática, también al editar).
function prepararProducto(datos) {
  return {
    id: String(datos.id).trim(),
    nombre: String(datos.nombre).trim(),
    descripcion: String(datos.descripcion).trim(),
    precio: Math.round(Number(datos.precio)),
    categoria: String(datos.categoria).trim(),
    stock: Number(datos.stock),
    multimedia: Array.isArray(datos.multimedia) ? datos.multimedia : [],
    enlaceCompra: String(datos.enlaceCompra).trim(),
    activo: datos.activo !== false, // Modo estándar: activo por defecto.
    fechaCreacion: new Date().toISOString(),
  };
}

// Crea un producto nuevo.
export function crearProducto(datos) {
  const productos = obtenerProductos();
  const errores = validarProducto(datos, productos, null);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const nuevo = prepararProducto(datos);
  const lista = [nuevo, ...productos];
  const resultado = escribir(CLAVES.productos, lista);
  if (!resultado.ok) return { ok: false, errores: { general: resultado.error } };
  return { ok: true, producto: nuevo, productos: lista };
}

// Edita un producto existente (identificado por su ID original, que también se puede cambiar).
export function actualizarProducto(idOriginal, datos) {
  const productos = obtenerProductos();
  if (!productos.some((p) => p.id === idOriginal)) {
    return { ok: false, errores: { general: 'El producto que intentas editar ya no existe.' } };
  }

  const errores = validarProducto(datos, productos, idOriginal);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const actualizado = prepararProducto(datos);
  const lista = productos.map((p) => (p.id === idOriginal ? actualizado : p));
  const resultado = escribir(CLAVES.productos, lista);
  if (!resultado.ok) return { ok: false, errores: { general: resultado.error } };
  return { ok: true, producto: actualizado, productos: lista };
}

// Elimina un producto por ID.
export function eliminarProducto(id) {
  const lista = obtenerProductos().filter((p) => p.id !== id);
  const resultado = escribir(CLAVES.productos, lista);
  return { ok: resultado.ok, productos: lista, error: resultado.error };
}

// Alterna el estado entre activo e inactivo. No modifica la fecha de creación.
export function cambiarEstadoProducto(id) {
  const lista = obtenerProductos().map((p) => (p.id === id ? { ...p, activo: !p.activo } : p));
  const resultado = escribir(CLAVES.productos, lista);
  return { ok: resultado.ok, productos: lista, error: resultado.error };
}

// Registra una compra: resta 1 unidad de stock (solo si hay y el producto está activo).
export function comprarProducto(id) {
  const productos = obtenerProductos();
  const producto = productos.find((p) => p.id === id);

  if (!producto) return { ok: false, error: 'El producto ya no está disponible.' };
  if (!producto.activo) return { ok: false, error: 'Este producto no está disponible actualmente.' };
  if (producto.stock <= 0) return { ok: false, error: 'Este producto está agotado.' };

  const lista = productos.map((p) => (p.id === id ? { ...p, stock: p.stock - 1 } : p));
  const resultado = escribir(CLAVES.productos, lista);
  if (!resultado.ok) return { ok: false, error: resultado.error };
  return { ok: true, producto: producto, productos: lista };
}
