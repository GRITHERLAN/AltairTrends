// ============================================================
// categoriasService.js
// "BackEnd" simulado de las categorías creadas a mano por el administrador.
// Las categorías de los productos se calculan a partir de los propios
// productos; aquí solo se guardan las categorías "extra" (creadas desde el
// botón "Crear categoría") para que existan aunque aún no tengan productos.
// ============================================================

import { CLAVES, borrar, escribir, leer } from './almacenamiento';

// Compara textos sin importar mayúsculas, minúsculas ni espacios sobrantes.
function normalizar(texto) {
  return String(texto).trim().toLowerCase();
}

// Devuelve las categorías extra guardadas (lista de textos).
export function obtenerCategoriasExtra() {
  const guardadas = leer(CLAVES.categorias, []);
  return Array.isArray(guardadas) ? guardadas : [];
}

// Valida el nombre de una categoría. "existentes" son TODAS las categorías conocidas
// (las de los productos y las extra). Devuelve el mensaje de error o '' si es válido.
export function validarCategoria(nombre, existentes) {
  const limpio = String(nombre ?? '').trim();
  if (limpio === '') return 'El nombre de la categoría es obligatorio.';
  if (existentes.some((categoria) => normalizar(categoria) === normalizar(limpio))) {
    return 'Ya existe una categoría con este nombre.';
  }
  return '';
}

// Crea una categoría extra. Vuelve a validar (BackEnd) antes de guardar.
// "existentes" son las categorías que ya conoce la aplicación.
export function crearCategoria(nombre, existentes) {
  const error = validarCategoria(nombre, existentes);
  if (error !== '') return { ok: false, error };

  const limpio = String(nombre).trim();
  const lista = [...obtenerCategoriasExtra(), limpio];
  const resultado = escribir(CLAVES.categorias, lista);
  if (!resultado.ok) return { ok: false, error: resultado.error };
  return { ok: true, categoria: limpio, categoriasExtra: lista };
}

// Borra las categorías extra (se usa al restablecer los datos de prueba).
export function reiniciarCategoriasExtra() {
  borrar(CLAVES.categorias);
  return [];
}
