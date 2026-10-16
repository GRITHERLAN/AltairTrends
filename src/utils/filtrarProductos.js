// ============================================================
// filtrarProductos.js
// Lógica única de filtrado y ordenamiento usada por el catálogo
// del usuario y por el panel del administrador.
// ============================================================

import { requiereModificacion } from './formatos';

// Opciones de orden disponibles (valor interno + texto visible).
export const OPCIONES_ORDEN = [
  { valor: 'recientes', texto: 'Agregados recientemente (nuevo a antiguo)' },
  { valor: 'fecha-antiguo', texto: 'Fecha: más antiguo a más reciente' },
  { valor: 'fecha-reciente', texto: 'Fecha: más reciente a más antiguo' },
  { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
  { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
  { valor: 'stock-desc', texto: 'Stock: mucho a poco' },
  { valor: 'stock-asc', texto: 'Stock: poco a mucho' },
];

// Filtros iniciales (sin ningún filtro aplicado).
export const FILTROS_INICIALES = {
  id: '',
  nombre: '',
  estado: 'todos', // 'todos' | 'activos' | 'inactivos' (solo lo usa el admin)
  categoria: 'todas',
  orden: 'recientes',
  soloAntiguos: false, // Solo admin: productos con más de 20 días
};

// Devuelve una función de comparación según el orden elegido.
function comparador(orden) {
  const fecha = (p) => new Date(p.fechaCreacion).getTime();
  switch (orden) {
    case 'fecha-antiguo':
      return (a, b) => fecha(a) - fecha(b);
    case 'precio-desc':
      return (a, b) => b.precio - a.precio;
    case 'precio-asc':
      return (a, b) => a.precio - b.precio;
    case 'stock-desc':
      return (a, b) => b.stock - a.stock;
    case 'stock-asc':
      return (a, b) => a.stock - b.stock;
    // 'recientes' y 'fecha-reciente' ordenan del más nuevo al más antiguo.
    default:
      return (a, b) => fecha(b) - fecha(a);
  }
}

// Aplica los filtros y el orden. "soloActivos" fuerza mostrar únicamente activos (panel usuario).
export function filtrarProductos(productos, filtros, soloActivos = false) {
  const texto = filtros.nombre.trim().toLowerCase();
  const id = filtros.id.trim().toLowerCase();

  const resultado = productos.filter((p) => {
    if (soloActivos && !p.activo) return false;
    if (!soloActivos && filtros.estado === 'activos' && !p.activo) return false;
    if (!soloActivos && filtros.estado === 'inactivos' && p.activo) return false;
    if (id && !p.id.toLowerCase().includes(id)) return false;
    if (texto && !p.nombre.toLowerCase().includes(texto)) return false;
    if (filtros.categoria !== 'todas' && p.categoria !== filtros.categoria) return false;
    if (filtros.soloAntiguos && !requiereModificacion(p)) return false;
    return true;
  });

  return resultado.sort(comparador(filtros.orden));
}

// Lista de categorías únicas existentes (para los chips y selectores).
export function obtenerCategorias(productos) {
  return [...new Set(productos.map((p) => p.categoria))].sort((a, b) => a.localeCompare(b, 'es'));
}
