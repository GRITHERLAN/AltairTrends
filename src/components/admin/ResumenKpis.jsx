// ============================================================
// ResumenKpis.jsx
// Tarjetas-resumen del inventario para el administrador.
// ============================================================

import { formatoCop } from '../../utils/formatos';

// Un producto con menos unidades que este número se considera en stock crítico.
export const STOCK_CRITICO = 6;

export default function ResumenKpis({ productos }) {
  const activos = productos.filter((p) => p.activo);
  const inactivos = productos.filter((p) => !p.activo);
  // Valor del inventario: precio x stock de los productos activos.
  const valorInventario = activos.reduce((suma, p) => suma + p.precio * p.stock, 0);
  const criticos = productos.filter((p) => p.stock < STOCK_CRITICO);

  const tarjetas = [
    { etiqueta: 'Total productos', valor: productos.length },
    { etiqueta: 'Activos', valor: activos.length },
    { etiqueta: 'Inactivos', valor: inactivos.length },
    { etiqueta: 'Valor inventario (COP)', valor: formatoCop(valorInventario) },
    { etiqueta: `Stock crítico (menos de ${STOCK_CRITICO})`, valor: criticos.length },
  ];

  return (
    <ul className="kpis" aria-label="Resumen del inventario">
      {tarjetas.map((tarjeta) => (
        <li key={tarjeta.etiqueta} className="kpi">
          <span className="kpi__etiqueta">{tarjeta.etiqueta}</span>
          <strong className="kpi__valor">{tarjeta.valor}</strong>
        </li>
      ))}
    </ul>
  );
}
