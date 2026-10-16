// ============================================================
// formatos.js
// Funciones pequeñas para mostrar precios y fechas en español.
// ============================================================

// Formateador de pesos colombianos (COP), sin decimales. Ej.: $ 850.000
const formateadorCop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

// Convierte 850000 en "$ 850.000".
export function formatoCop(valor) {
  return formateadorCop.format(valor).replace(/ /g, ' ');
}

// Convierte una fecha ISO en "12 ene 2025".
export function formatoFecha(fechaIso) {
  return new Date(fechaIso).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Cuántos días completos han pasado desde una fecha ISO hasta hoy.
export function diasDesde(fechaIso) {
  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const diferencia = Date.now() - new Date(fechaIso).getTime();
  return Math.max(0, Math.floor(diferencia / milisegundosPorDia));
}

// Días a partir de los cuales un producto requiere modificación (alerta del admin).
export const DIAS_ALERTA = 20;

// Indica si el producto lleva más de 20 días sin modificarse.
export function requiereModificacion(producto) {
  return diasDesde(producto.fechaCreacion) > DIAS_ALERTA;
}

// Texto legible de antigüedad: "Hoy", "1 día", "8 días".
export function textoAntiguedad(fechaIso) {
  const dias = diasDesde(fechaIso);
  if (dias === 0) return 'Hoy';
  return dias === 1 ? 'Hace 1 día' : `Hace ${dias} días`;
}
