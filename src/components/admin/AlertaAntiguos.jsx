// ============================================================
// AlertaAntiguos.jsx
// Notificación de productos con más de 20 días desde su fecha de ingreso.
// Desaparece sola cuando esos productos se modifican (la fecha se renueva).
// ============================================================

import { DIAS_ALERTA } from '../../utils/formatos';

export default function AlertaAntiguos({ antiguos, onFiltrar, filtrando, onEditar }) {
  // Sin productos antiguos no se muestra nada.
  if (antiguos.length === 0) return null;

  return (
    <section className="alerta" role="alert" aria-labelledby="titulo-alerta">
      <div className="alerta__texto">
        <h2 id="titulo-alerta" className="alerta__titulo">
          Alerta de inventario: {antiguos.length} {antiguos.length === 1 ? 'producto' : 'productos'} con fecha de ingreso superior a {DIAS_ALERTA} días
        </h2>
        <p>Requieren revisión y modificación para mantener el catálogo optimizado. La alerta se quita al guardar los cambios.</p>
        <ul className="alerta__lista">
          {antiguos.map((producto) => (
            <li key={producto.id}>
              <button type="button" className="boton boton--enlace" onClick={() => onEditar(producto)}>
                {producto.id} · {producto.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button type="button" className="boton boton--secundario" onClick={onFiltrar}>
        {filtrando ? 'Quitar filtro de antiguos' : 'Filtrar productos antiguos'}
      </button>
    </section>
  );
}
