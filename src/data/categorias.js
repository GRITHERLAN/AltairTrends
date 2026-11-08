// ============================================================
// categorias.js (datos)
// Textos SEO de cada página de categoría (/categoria/<slug>).
// La clave es el slug: "Juguetería" -> "jugueteria", "Vehículo" -> "vehiculo".
//
// - titulo: H1 de la página y <title> (máx. ~45 caracteres; se añade " | AltairTrends").
// - descripcion: meta description (máx. ~155 caracteres).
// - intro: párrafo visible bajo el título. Describe tipos de producto reales;
//   si cambia mucho el catálogo, revisa que siga siendo cierto.
//
// Una categoría nueva sin entrada aquí también funciona: usa textos genéricos.
// ============================================================

export const TEXTOS_CATEGORIAS = {
  hogar: {
    titulo: 'Artículos para el hogar',
    descripcion:
      'Organizadores, lámparas, difusores de aroma, humidificadores y decoración navideña para tu casa. Precios en COP y envío a toda Colombia.',
    intro:
      'Productos prácticos para organizar, iluminar y ambientar tu casa: organizadores y zapateros, lámparas, difusores de aroma, humidificadores, artículos de cocina, accesorios de viaje y decoración navideña.',
  },
  jugueteria: {
    titulo: 'Juguetes y juegos educativos',
    descripcion:
      'Peluches, carros a control remoto, dinosaurios, sets de construcción y juegos educativos para niños. Precios en COP y envío a toda Colombia.',
    intro:
      'Juguetes para aprender y divertirse: peluches, carros y dinosaurios a control remoto, sets de construcción, tabletas de dibujo, juegos educativos y regalos para bebés y niños.',
  },
  belleza: {
    titulo: 'Belleza y cuidado personal',
    descripcion:
      'Depiladores, exfoliantes, tratamientos capilares y organizadores de maquillaje. Precios en COP y envío a toda Colombia.',
    intro:
      'Artículos para tu rutina de cuidado personal: depilación, cuidado de la piel y del cabello, higiene dental y organización del maquillaje.',
  },
  tecnologia: {
    titulo: 'Tecnología y gadgets',
    descripcion: 'Gadgets prácticos como lámparas proyector y soportes para tablet. Precios en COP y envío a toda Colombia.',
    intro: 'Gadgets y accesorios tecnológicos para tu casa y tu escritorio, como lámparas proyector y soportes para tablet.',
  },
  bienestar: {
    titulo: 'Bienestar y descanso',
    descripcion: 'Cojines ergonómicos y productos para aliviar el cuello y la espalda. Precios en COP y envío a toda Colombia.',
    intro: 'Productos para descansar mejor y aliviar tensiones del día a día, como cojines ergonómicos y geles enfriadores.',
  },
  mascotas: {
    titulo: 'Productos para mascotas',
    descripcion: 'Juguetes para gatos y accesorios para peceras. Precios en COP y envío a toda Colombia.',
    intro: 'Juguetes y accesorios para consentir a tus mascotas, de gatos a peces.',
  },
  vehiculo: {
    titulo: 'Accesorios para carro y moto',
    descripcion: 'Candados para moto, ventiladores de 12 V y otros accesorios para tu vehículo. Precios en COP y envío a toda Colombia.',
    intro: 'Accesorios prácticos para tu carro o tu moto: seguridad, comodidad y ventilación en el camino.',
  },
};

// Categorías demasiado pequeñas o genéricas no se indexan (contenido "delgado"):
// se pueden visitar, pero llevan noindex y no entran en el sitemap.
const MINIMO_PRODUCTOS = 2;
const NO_INDEXAR = ['otros'];

export function categoriaIndexable(categoria) {
  return categoria.cantidad >= MINIMO_PRODUCTOS && !NO_INDEXAR.includes(categoria.slug);
}

// Textos de una categoría ({ slug, nombre, cantidad }), con valores genéricos si no tiene entrada.
export function textosCategoria(categoria) {
  return (
    TEXTOS_CATEGORIAS[categoria.slug] ?? {
      titulo: categoria.nombre,
      descripcion: `Compra productos de ${categoria.nombre} en AltairTrends. Precios en COP, envío a toda Colombia y atención por WhatsApp.`,
      intro: `Productos de la categoría ${categoria.nombre}, con precios en pesos colombianos y envío a toda Colombia.`,
    }
  );
}
