// ============================================================
// seo.js
// Datos generales del sitio para buscadores y redes sociales.
// Los usa el hook useMetaPagina (títulos, descripciones, enlaces
// canónicos) y el script scripts/generar-sitemap.mjs.
// Si cambias el título o la descripción por defecto, cámbialos también
// en index.html (es lo que ve Google antes de que cargue React).
// ============================================================

export const SITIO = {
  url: 'https://altairtrends.com',
  nombre: 'AltairTrends',
  titulo: 'AltairTrends | Hogar, juguetes y tendencias en Colombia',
  descripcion:
    'Tienda online colombiana con productos para el hogar, juguetes, belleza, tecnología y mascotas. Precios en COP, envío a toda Colombia y atención por WhatsApp.',
  // Imagen que aparece al compartir un enlace en WhatsApp, Instagram, Facebook...
  imagen: '/og-imagen.jpg',
};

// Páginas públicas fijas (además de una por cada producto).
export const PAGINAS_PUBLICAS = ['/', '/sobre-nosotros', '/privacidad', '/terminos', '/cookies'];
