// ============================================================
// PaginaSobreNosotros.jsx
// Descripción de la marca e indicadores. Ambos se editan desde el
// panel de administración (vienen del ConfigContext).
// ============================================================

import { useConfig } from '../context/ConfigContext';
import { enlaceInterno } from '../utils/rutasCifradas';

export default function PaginaSobreNosotros() {
  const { config } = useConfig();

  return (
    <>
      <section className="heroe contenedor" aria-labelledby="titulo-sobre">
        <h1 id="titulo-sobre" className="heroe__titulo">
          AltairTrends: <span className="texto-acento">¡Alza vuelo con Altair!</span>
        </h1>
        <p className="heroe__texto">
          Donde las tendencias alzan vuelo.
          Tienda online colombiana inspirada en la visión del águila: clara, audaz y siempre a la vanguardia.
          Productos únicos y funcionales para quienes quieren destacar.
        </p>
      </section>

      <section className="contenedor bloque" aria-labelledby="titulo-filosofia">
        <h2 id="titulo-filosofia" className="titulo-seccion">
          Filosofía y Misión de Marca
        </h2>
        {/* La descripción se divide por saltos de línea para respetar los párrafos que escriba el admin */}
        {config.descripcion.split('\n').map((parrafo, posicion) => (
          <p key={posicion} className="bloque__texto">
            {parrafo}
          </p>
        ))}
      </section>

      {/* Si el administrador quitó todos los indicadores, la sección no se muestra */}
      {config.indicadores.length > 0 && (
        <section className="contenedor bloque" aria-labelledby="titulo-indicadores">
          <p className="etiqueta-seccion">Rendimiento y confianza</p>
          <h2 id="titulo-indicadores" className="titulo-seccion">
            Indicadores Clave de Desempeño
          </h2>
          <ul className="indicadores">
            {/* key por posición: el nombre del indicador puede repetirse */}
            {config.indicadores.map((indicador, posicion) => (
              <li key={posicion} className="indicador">
                <strong className="indicador__valor">{indicador.valor}</strong>
                <span className="indicador__etiqueta">{indicador.etiqueta}</span>
                <p className="indicador__detalle">{indicador.detalle}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="contenedor bloque">
        <a className="boton boton--primario" href={enlaceInterno('/contacto')}>
          Contáctanos
        </a>
      </section>
    </>
  );
}
