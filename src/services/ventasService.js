// ============================================================
// ventasService.js
// Contadores de compras que alimentan los gráficos estadísticos del
// panel de administración. Viven en dos tablas de Supabase:
//
//   1) ventas_categoria -> se entrega como { 'Joyería Fina': 4, 'Perfumería': 2, ... }
//   2) ventas_producto  -> se entrega como { 'ALT-101': { nombre: 'Reloj...', cantidad: 3 }, ... }
//
// Se guardan aparte de los productos para que el histórico no se pierda si el
// administrador borra un producto o le cambia la categoría. Solo el Administrador
// puede leerlas (RLS); los visitantes solo las incrementan con registrar_compra().
// ============================================================

import { mensajeDeError } from './erroresSupabase';
import { supabase } from './supabaseCliente';

// Devuelve el contador completo de compras por categoría.
export async function obtenerVentasPorCategoria() {
  const { data, error } = await supabase.from('ventas_categoria').select('categoria, cantidad');
  if (error) return { ok: false, ventas: {}, error: mensajeDeError(error) };

  // Se convierte la lista de filas en el objeto que usan los gráficos.
  const ventas = {};
  data.forEach((fila) => {
    ventas[fila.categoria] = fila.cantidad;
  });
  return { ok: true, ventas };
}

// Devuelve el contador completo de compras por producto.
export async function obtenerVentasPorProducto() {
  const { data, error } = await supabase.from('ventas_producto').select('producto_id, nombre, cantidad');
  if (error) return { ok: false, ventasProducto: {}, error: mensajeDeError(error) };

  const ventasProducto = {};
  data.forEach((fila) => {
    ventasProducto[fila.producto_id] = { nombre: fila.nombre, cantidad: fila.cantidad };
  });
  return { ok: true, ventasProducto };
}
