// ============================================================
// categoriasService.js
// BackEnd de las categorías creadas a mano por el administrador
// (tabla "categorias" de Supabase, solo accesible para el Administrador).
// Las categorías de los productos se calculan a partir de los propios
// productos; aquí solo se guardan las categorías "extra" (creadas desde el
// botón "Crear categoría") para que existan aunque aún no tengan productos.
// ============================================================

import { esValorRepetido, mensajeDeError } from './erroresSupabase';
import { supabase } from './supabaseCliente';

// Longitud máxima (igual que la restricción CHECK de la tabla).
const LARGO_MAXIMO = 60;

// Compara textos sin importar mayúsculas, minúsculas ni espacios sobrantes.
function normalizar(texto) {
  return String(texto).trim().toLowerCase();
}

// Devuelve las categorías extra guardadas (lista de textos).
export async function obtenerCategoriasExtra() {
  const { data, error } = await supabase.from('categorias').select('nombre').order('nombre');
  if (error) return { ok: false, categorias: [], error: mensajeDeError(error) };
  return { ok: true, categorias: data.map((fila) => fila.nombre) };
}

// Valida el nombre de una categoría. "existentes" son TODAS las categorías conocidas
// (las de los productos y las extra). Devuelve el mensaje de error o '' si es válido.
export function validarCategoria(nombre, existentes) {
  const limpio = String(nombre ?? '').trim();
  if (limpio === '') return 'El nombre de la categoría es obligatorio.';
  if (limpio.length > LARGO_MAXIMO) return `El nombre puede tener como máximo ${LARGO_MAXIMO} caracteres.`;
  if (existentes.some((categoria) => normalizar(categoria) === normalizar(limpio))) {
    return 'Ya existe una categoría con este nombre.';
  }
  return '';
}

// Crea una categoría extra. Vuelve a validar antes de guardar y la base de datos
// impide repetidos con su restricción UNIQUE.
export async function crearCategoria(nombre, existentes) {
  const error = validarCategoria(nombre, existentes);
  if (error !== '') return { ok: false, error };

  const limpio = String(nombre).trim();
  const resultado = await supabase.from('categorias').insert({ nombre: limpio });
  if (resultado.error) {
    const mensaje = esValorRepetido(resultado.error) ? 'Ya existe una categoría con este nombre.' : mensajeDeError(resultado.error);
    return { ok: false, error: mensaje };
  }
  return { ok: true, categoria: limpio };
}
