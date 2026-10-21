// ============================================================
// almacenamiento.js
// Capa mínima sobre LocalStorage. Todo el "backend" simulado
// (servicios de productos, usuarios y configuración) pasa por aquí.
// ============================================================

// Claves con las que se guarda cada tipo de dato en LocalStorage.
export const CLAVES = {
  productos: 'altair_productos',
  usuarios: 'altair_usuarios',
  sesion: 'altair_sesion',
  config: 'altair_config',
  mensajes: 'altair_mensajes',
  ventasCategoria: 'altair_ventas_categoria', // Contador de compras por categoría
  ventasProducto: 'altair_ventas_producto', // Contador de compras por producto
  categorias: 'altair_categorias', // Categorías creadas a mano (aún sin productos)
};

// Lee una clave y la convierte de texto JSON a objeto.
// Si no existe o el JSON está dañado, devuelve el valor por defecto.
export function leer(clave, valorPorDefecto = null) {
  try {
    const texto = window.localStorage.getItem(clave);
    if (texto === null) return valorPorDefecto;
    return JSON.parse(texto);
  } catch (error) {
    return valorPorDefecto;
  }
}

// Guarda un valor como JSON.
// Devuelve { ok: true } o { ok: false, error } (por ejemplo, si se llenó el almacenamiento).
export function escribir(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: 'No hay espacio suficiente en el almacenamiento local. Usa imágenes más pequeñas o enlaces (URL).',
    };
  }
}

// Elimina una clave.
export function borrar(clave) {
  try {
    window.localStorage.removeItem(clave);
  } catch (error) {
    // Si el navegador bloquea el almacenamiento no hay nada más que hacer.
  }
}
