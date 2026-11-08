// ============================================================
// slug.js
// URLs legibles para los productos, buenas para Google y para las personas:
//   "Reloj Cronógrafo Altair Obsidian" + "ALT-102"
//   -> /producto/reloj-cronografo-altair-obsidian-alt-102
// El ID va al final para que la URL sea única y, si el admin cambia el
// nombre, los enlaces antiguos sigan encontrando el producto.
// Sin dependencias de React ni de Vite: también lo usa el script del sitemap.
// ============================================================

// "Perfume Extracto 'Nébula'" -> "perfume-extracto-nebula"
export function slugificar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function slugProducto(producto) {
  return [slugificar(producto.nombre), slugificar(producto.id)].filter(Boolean).join('-');
}

export function rutaProducto(producto) {
  return `/producto/${slugProducto(producto)}`;
}

// Busca el producto de una URL. Acepta:
//   - el slug actual ("reloj-cronografo-altair-obsidian-alt-102"),
//   - un slug con un nombre antiguo (se reconoce por el ID del final),
//   - solo el ID ("ALT-102", de los enlaces cifrados antiguos).
export function buscarProductoPorSlug(productos, slug) {
  const buscado = slugificar(slug);
  const exacto = productos.find((producto) => slugProducto(producto) === buscado);
  if (exacto) return exacto;

  // Por el ID del final. Si varios encajan, gana el ID más largo (el más específico).
  return productos
    .filter((producto) => {
      const id = slugificar(producto.id);
      return id && (buscado === id || buscado.endsWith(`-${id}`));
    })
    .sort((a, b) => slugificar(b.id).length - slugificar(a.id).length)[0];
}
