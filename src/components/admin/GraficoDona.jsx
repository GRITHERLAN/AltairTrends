// ============================================================
// GraficoDona.jsx
// Gráfico circular (tipo dona) genérico del panel de administración.
// Lo usan "Compras por categoría" y "Compras por producto".
// Lógica: porcentaje de un elemento = (compras del elemento / compras totales) x 100.
// Se dibuja con SVG nativo (sin librerías externas) y se actualiza solo
// cada vez que alguien pulsa "Comprar".
//
// Props:
//   idTitulo     id del <h2> (para aria-labelledby; debe ser único en la página)
//   titulo       título de la card
//   subtitulo    texto explicativo bajo el título
//   filas        [{ clave, nombre, cantidad }] elementos a graficar
//   textoVacio   mensaje cuando todavía no hay compras
//   etiquetaItem palabra que se muestra en el centro al resaltar ("Categoría", "Producto")
//   limite       (opcional) máximo de elementos a mostrar; el resto se agrupa en una fila aparte
//   nombreOtros  (opcional) nombre de esa fila agrupada: "Otros" (por defecto) u "Otras"
// ============================================================

import { useState } from 'react';
import { useEsMovil } from '../../hooks/useEsMovil';
import Modal from '../ui/Modal';

// Geometría del gráfico (unidades internas del SVG; el tamaño real lo da el CSS en rem).
const CENTRO = 100;
const RADIO = 80;
const GROSOR = 28;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

// Cantidad de colores definidos en variables.css (--grafico-1 ... --grafico-8).
const TOTAL_COLORES = 8;

// Identificador interno de la fila que agrupa al resto de elementos.
const CLAVE_OTROS = '__otros__';

// 12,5 en lugar de 12.5 (formato colombiano, con coma decimal).
function formatoPorcentaje(valor) {
  return `${valor.toFixed(1).replace('.', ',')} %`;
}

// De mayor a menor cantidad; si empatan, por nombre.
function compararPorCantidad(a, b) {
  return b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, 'es');
}

// Prepara las filas que se van a dibujar (con color) según haya o no límite.
function prepararFilas(filas, limite, nombreOtros) {
  // Sin límite: se muestran todas y cada una conserva siempre su color
  // (el color depende del orden alfabético, no del ranking).
  if (!limite) {
    const alfabeticas = [...filas].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    return alfabeticas
      .map((fila, posicion) => ({ ...fila, color: `var(--grafico-${(posicion % TOTAL_COLORES) + 1})` }))
      .sort(compararPorCantidad);
  }

  // Con límite: solo los que tienen compras, los primeros por ranking y el resto en "Otros".
  const conCompras = filas.filter((fila) => fila.cantidad > 0).sort(compararPorCantidad);
  const principales = conCompras.slice(0, limite).map((fila, posicion) => ({ ...fila, color: `var(--grafico-${posicion + 1})` }));
  const resto = conCompras.slice(limite);

  if (resto.length === 0) return principales;
  const cantidadOtros = resto.reduce((suma, fila) => suma + fila.cantidad, 0);
  // "agrupados" guarda qué elementos quedaron dentro de "Otros" (se muestran en la modal de detalle).
  return [...principales, { clave: CLAVE_OTROS, nombre: nombreOtros, cantidad: cantidadOtros, color: 'var(--grafico-otros)', agrupados: resto }];
}

export default function GraficoDona({ idTitulo, titulo, subtitulo, filas, textoVacio, etiquetaItem, limite, nombreOtros = 'Otros' }) {
  // Clave del elemento sobre el que está el cursor/foco (null = se muestra el dominante).
  const [activa, setActiva] = useState(null);
  // Si está abierta la modal con el detalle de "Otros".
  const [detalleAbierto, setDetalleAbierto] = useState(false);
  // En celular la leyenda empieza cerrada (menú desplegable).
  const esMovil = useEsMovil();
  const [leyendaAbierta, setLeyendaAbierta] = useState(false);
  // id de la leyenda, para relacionarla con su botón (aria-controls).
  const idLeyenda = `${idTitulo}-leyenda`;

  // 1) Total de compras (se calcula con TODAS las filas, incluidas las que van en "Otros").
  const total = filas.reduce((suma, fila) => suma + fila.cantidad, 0);

  // 2) Filas a dibujar, con su porcentaje (cantidad / total x 100).
  const visibles = prepararFilas(filas, limite, nombreOtros).map((fila) => ({
    ...fila,
    porcentaje: total > 0 ? (fila.cantidad / total) * 100 : 0,
  }));

  // El dominante es el primero de la lista (el de más compras; "Otros" siempre va al final).
  const dominante = total > 0 ? visibles[0] : null;
  // Lo que se muestra en el centro: el elemento resaltado o, si no hay, el dominante.
  const mostrada = visibles.find((fila) => fila.clave === activa) ?? dominante;

  // 3) Segmentos del círculo: cada uno empieza donde termina el anterior.
  let acumulado = 0;
  const segmentos = visibles
    .filter((fila) => fila.cantidad > 0)
    .map((fila) => {
      const largo = (fila.porcentaje / 100) * CIRCUNFERENCIA;
      const segmento = { ...fila, largo, desplazamiento: -acumulado };
      acumulado += largo;
      return segmento;
    });

  // Fila "Otros" (si existe) para mostrar de qué elementos está compuesta.
  const otros = visibles.find((fila) => fila.clave === CLAVE_OTROS);

  const descripcion = dominante
    ? `${titulo}. Domina ${dominante.nombre} con ${formatoPorcentaje(dominante.porcentaje)}.`
    : `${titulo}. Aún no hay compras registradas.`;

  return (
    <section className="tarjeta-panel" aria-labelledby={idTitulo}>
      <header className="panel__cabecera">
        <div>
          <h2 id={idTitulo} className="titulo-seccion titulo-seccion--pequeno">
            {titulo}
          </h2>
          <p className="catalogo__subtitulo">{subtitulo}</p>
        </div>
        <span className="insignia insignia--dorada">Total compras: {total}</span>
      </header>

      {total === 0 ? (
        <p className="grafico__vacio">{textoVacio}</p>
      ) : (
        <div className="grafico">
          <div className="grafico__donut">
            <svg viewBox="0 0 200 200" role="img" aria-label={descripcion}>
              {/* Pista de fondo del anillo */}
              <circle className="grafico__pista" cx={CENTRO} cy={CENTRO} r={RADIO} strokeWidth={GROSOR} />
              {/* Un arco por elemento con compras. Se rota -90° para empezar arriba. */}
              {segmentos.map((segmento) => (
                <circle
                  key={segmento.clave}
                  className={`grafico__segmento${mostrada && mostrada.clave !== segmento.clave ? ' grafico__segmento--atenuado' : ''}`}
                  cx={CENTRO}
                  cy={CENTRO}
                  r={RADIO}
                  strokeWidth={GROSOR}
                  strokeDasharray={`${segmento.largo} ${CIRCUNFERENCIA - segmento.largo}`}
                  strokeDashoffset={segmento.desplazamiento}
                  transform={`rotate(-90 ${CENTRO} ${CENTRO})`}
                  style={{ stroke: segmento.color }}
                  onMouseEnter={() => setActiva(segmento.clave)}
                  onMouseLeave={() => setActiva(null)}
                  // Pulsar el arco de "Otros" abre su detalle.
                  onClick={segmento.clave === CLAVE_OTROS ? () => setDetalleAbierto(true) : undefined}
                />
              ))}
            </svg>

            {/* Texto del centro: el que domina (o el que se está resaltando) */}
            <div className="grafico__centro" aria-live="polite">
              <span className="grafico__centro-etiqueta">{mostrada.clave === dominante.clave ? 'Domina' : etiquetaItem}</span>
              <strong className="grafico__centro-nombre" style={{ color: mostrada.color }}>
                {mostrada.nombre}
              </strong>
              <span className="grafico__centro-valor">{formatoPorcentaje(mostrada.porcentaje)}</span>
            </div>
          </div>

          <div className="grafico__panel">
            {/* En celular la leyenda va en un menú desplegable: este botón la abre y la cierra */}
            {esMovil && (
              <button
                type="button"
                className="boton boton--secundario grafico__alternar"
                aria-expanded={leyendaAbierta}
                aria-controls={idLeyenda}
                onClick={() => setLeyendaAbierta(!leyendaAbierta)}
              >
                {leyendaAbierta ? 'Ocultar leyenda' : 'Ver leyenda'}
                <span className={`grafico__flecha${leyendaAbierta ? ' grafico__flecha--abierta' : ''}`} aria-hidden="true" />
              </button>
            )}

            {/* En escritorio y tablet la leyenda siempre se ve; en celular solo si el menú está abierto */}
            {(!esMovil || leyendaAbierta) && (
              <ul id={idLeyenda} className="grafico__leyenda" aria-label="Detalle del gráfico">
                {visibles.map((fila) => (
                  <li
                    key={fila.clave}
                    className={`grafico__item${activa === fila.clave ? ' grafico__item--activo' : ''}`}
                    tabIndex={0}
                    onMouseEnter={() => setActiva(fila.clave)}
                    onMouseLeave={() => setActiva(null)}
                    onFocus={() => setActiva(fila.clave)}
                    onBlur={() => setActiva(null)}
                  >
                    <span className="grafico__muestra" style={{ backgroundColor: fila.color }} aria-hidden="true" />
                    <span className="grafico__nombre">
                      {fila.nombre}
                      {/* Solo "Otros" tiene detalle. type="button" para no enviar ningún formulario. */}
                      {fila.clave === CLAVE_OTROS && (
                        <button type="button" className="boton boton--enlace boton--pequeno grafico__detalle" onClick={() => setDetalleAbierto(true)}>
                          Ver detalle
                        </button>
                      )}
                    </span>
                    <span className="grafico__cantidad">
                      {fila.cantidad} {fila.cantidad === 1 ? 'compra' : 'compras'}
                    </span>
                    <strong className="grafico__porcentaje">{formatoPorcentaje(fila.porcentaje)}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Modal con el resumen de lo que está agrupado en "Otros" */}
      {detalleAbierto && otros && (
        <Modal titulo={`Detalle de «${nombreOtros}»`} onCerrar={() => setDetalleAbierto(false)}>
          <p className="modal__mensaje">
            «{nombreOtros}» agrupa {otros.agrupados.length} {etiquetaItem.toLowerCase()}s que suman {otros.cantidad} {otros.cantidad === 1 ? 'compra' : 'compras'} ({formatoPorcentaje(otros.porcentaje)} del total).
          </p>
          <ul className="grafico__resumen" aria-label={`Elementos agrupados en ${nombreOtros}`}>
            {otros.agrupados.map((elemento) => (
              <li key={elemento.clave} className="grafico__item grafico__item--simple">
                <span className="grafico__nombre">{elemento.nombre}</span>
                <span className="grafico__cantidad">
                  {elemento.cantidad} {elemento.cantidad === 1 ? 'compra' : 'compras'}
                </span>
                <strong className="grafico__porcentaje">{formatoPorcentaje((elemento.cantidad / total) * 100)}</strong>
              </li>
            ))}
          </ul>
          <div className="modal__acciones">
            <button type="button" className="boton boton--secundario" onClick={() => setDetalleAbierto(false)}>
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
