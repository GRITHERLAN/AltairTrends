// ============================================================
// GraficoCategorias.jsx
// Gráfico de compras por categoría (Top 5 y el resto agrupado en "Otras").
// Solo prepara los datos; el dibujo lo hace GraficoDona.
// ============================================================

import GraficoDona from './GraficoDona';

// Cuántas categorías se muestran individualmente; el resto va en "Otras".
const TOP_CATEGORIAS = 5;

export default function GraficoCategorias({ productos, ventas }) {
  // Todas las categorías: las de los productos actuales + las que ya tienen compras
  // (por si se borró un producto, su histórico se conserva).
  const nombres = [...new Set([...productos.map((p) => p.categoria), ...Object.keys(ventas)])];

  const filas = nombres.map((nombre) => ({
    clave: nombre,
    nombre,
    cantidad: Number(ventas[nombre]) || 0,
  }));

  return (
    <GraficoDona
      idTitulo="titulo-grafico-categorias"
      titulo="Compras por categoría"
      subtitulo={`Top ${TOP_CATEGORIAS} de categorías más compradas; el resto se agrupa en "Otras". Porcentaje sobre el total de compras.`}
      filas={filas}
      textoVacio='Aún no hay compras registradas. El gráfico aparecerá cuando alguien pulse "Comprar" en un producto.'
      etiquetaItem="Categoría"
      limite={TOP_CATEGORIAS}
      nombreOtros="Otras"
    />
  );
}
