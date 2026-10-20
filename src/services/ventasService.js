// ============================================================
// ventasService.js
// Contadores de compras que alimentan los gráficos estadísticos del
// panel de administración. Hay dos, guardados aparte de los productos:
//
//   1) Por categoría:  { 'Joyería Fina': 4, 'Perfumería': 2, ... }
//   2) Por producto:   { 'PRD-001': { nombre: 'Reloj Aurora', cantidad: 3 }, ... }
//
// Al guardarlos aparte, el histórico no se pierde si el administrador borra
// un producto o le cambia la categoría. En el contador por producto se guarda
// también el nombre para poder seguir mostrando un producto ya borrado.
// ============================================================

import { CLAVES, leer, escribir } from './almacenamiento';

// Lee un contador guardado. Si no existe o está dañado, devuelve un objeto vacío.
function leerContador(clave) {
  const guardado = leer(clave, {});
  const esObjeto = guardado !== null && typeof guardado === 'object' && !Array.isArray(guardado);
  return esObjeto ? guardado : {};
}

// ---------- Por categoría ----------

// Devuelve el contador completo de compras por categoría.
export function obtenerVentasPorCategoria() {
  return leerContador(CLAVES.ventasCategoria);
}

// Suma 1 compra a la categoría indicada y devuelve el contador actualizado.
export function registrarVentaCategoria(categoria) {
  const ventas = obtenerVentasPorCategoria();
  const actualizadas = { ...ventas, [categoria]: (Number(ventas[categoria]) || 0) + 1 };

  const resultado = escribir(CLAVES.ventasCategoria, actualizadas);
  // Si no se pudo guardar, se devuelve el contador anterior para no mostrar datos falsos.
  return { ok: resultado.ok, ventas: resultado.ok ? actualizadas : ventas, error: resultado.error };
}

// ---------- Por producto ----------

// Devuelve el contador completo de compras por producto.
export function obtenerVentasPorProducto() {
  return leerContador(CLAVES.ventasProducto);
}

// Suma 1 compra al producto indicado (se identifica por su ID) y actualiza su nombre guardado.
export function registrarVentaProducto(producto) {
  const ventas = obtenerVentasPorProducto();
  const cantidadActual = Number(ventas[producto.id]?.cantidad) || 0;
  const actualizadas = { ...ventas, [producto.id]: { nombre: producto.nombre, cantidad: cantidadActual + 1 } };

  const resultado = escribir(CLAVES.ventasProducto, actualizadas);
  return { ok: resultado.ok, ventasProducto: resultado.ok ? actualizadas : ventas, error: resultado.error };
}

// ---------- Reinicio ----------

// Pone en cero AMBOS contadores (se usa al restablecer los datos de prueba).
export function reiniciarVentas() {
  const porCategoria = escribir(CLAVES.ventasCategoria, {});
  const porProducto = escribir(CLAVES.ventasProducto, {});
  return {
    ok: porCategoria.ok && porProducto.ok,
    ventas: {},
    ventasProducto: {},
    error: porCategoria.error ?? porProducto.error,
  };
}
