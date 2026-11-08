// ============================================================
// categorias.js
// Agrupa los productos por categoría para las páginas /categoria/<slug>.
// Dos categorías escritas casi igual ("Jugueteria" y "Juguetería") tienen el
// mismo slug, así que se tratan como UNA sola página.
// Sin dependencias de React ni de Vite: también lo usa el script del sitemap.
// ============================================================

import { slugificar } from './slug.js';

const TIENE_TILDE = /[^\u0000-\u007f]/;

// Devuelve [{ slug, nombre, cantidad, actualizado }] ordenado por nombre.
// "nombre" es la variante con tildes si existe (la mejor escrita) o la más usada.
export function agruparCategorias(productos) {
  const grupos = new Map();

  for (const producto of productos) {
    const slug = slugificar(producto.categoria);
    if (!slug) continue;
    const grupo = grupos.get(slug) ?? { slug, variantes: new Map(), cantidad: 0, actualizado: null };
    grupo.cantidad += 1;
    grupo.variantes.set(producto.categoria, (grupo.variantes.get(producto.categoria) ?? 0) + 1);
    const fecha = producto.fechaCreacion ?? producto.fecha_creacion;
    if (fecha && (!grupo.actualizado || fecha > grupo.actualizado)) grupo.actualizado = fecha;
    grupos.set(slug, grupo);
  }

  return [...grupos.values()]
    .map(({ variantes, ...grupo }) => {
      const [nombre] = [...variantes.entries()].sort(
        (a, b) => Number(TIENE_TILDE.test(b[0])) - Number(TIENE_TILDE.test(a[0])) || b[1] - a[1]
      )[0];
      return { ...grupo, nombre };
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

export function rutaCategoria(slugOCategoria) {
  return `/categoria/${slugificar(slugOCategoria)}`;
}
