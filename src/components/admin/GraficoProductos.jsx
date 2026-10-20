// ============================================================
// GraficoProductos.jsx
// Gráfico de compras por producto (Top 5 y el resto agrupado en "Otros").
// Solo prepara los datos; el dibujo lo hace GraficoDona.
// ============================================================

import GraficoDona from './GraficoDona';

// Cuántos productos se muestran individualmente; el resto va en "Otros".
const TOP_PRODUCTOS = 5;

export default function GraficoProductos({ productos, ventasProducto }) {
  // Una fila por producto con compras. Si el producto sigue existiendo se usa su nombre
  // actual; si fue borrado, se usa el nombre que se guardó en su última compra.
  const filas = Object.entries(ventasProducto).map(([id, registro]) => {
    const existente = productos.find((p) => p.id === id);
    return {
      clave: id,
      nombre: existente ? existente.nombre : registro?.nombre ?? id,
      cantidad: Number(registro?.cantidad) || 0,
    };
  });

  return (
    <GraficoDona
      idTitulo="titulo-grafico-productos"
      titulo="Compras por producto"
      subtitulo={`Top ${TOP_PRODUCTOS} de productos más comprados; el resto se agrupa en "Otros". Porcentaje sobre el total de compras.`}
      filas={filas}
      textoVacio='Aún no hay compras registradas. El gráfico aparecerá cuando alguien pulse "Comprar" en un producto.'
      etiquetaItem="Producto"
      limite={TOP_PRODUCTOS}
    />
  );
}
