// ============================================================
// PaginaSobreNosotros.jsx
// Descripción de la marca e indicadores (ambos se editan desde el panel
// de administración, vienen del ConfigContext) y preguntas frecuentes
// (data/preguntasFrecuentes.js).
// ============================================================

import { useConfig } from '../context/ConfigContext';
import { PREGUNTAS_FRECUENTES } from '../data/preguntasFrecuentes';
import { urlAbsoluta, useMetaPagina } from '../hooks/useMetaPagina';

const DESCRIPCION =
  'Conoce AltairTrends, tienda online de Dosquebradas, Risaralda, con productos únicos y funcionales para el hogar y la familia, y envíos a toda Colombia.';

export default function PaginaSobreNosotros() {
  const { config } = useConfig();

  useMetaPagina({
    titulo: 'Sobre nosotros',
    descripcion: DESCRIPCION,
    ruta: '/sobre-nosotros',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          name: 'Sobre AltairTrends',
          description: DESCRIPCION,
          url: urlAbsoluta('/sobre-nosotros'),
          about: { '@id': `${urlAbsoluta('/')}#tienda` },
        },
        {
          '@type': 'FAQPage',
          mainEntity: PREGUNTAS_FRECUENTES.map(({ pregunta, respuesta }) => ({
            '@type': 'Question',
            name: pregunta,
            acceptedAnswer: { '@type': 'Answer', text: respuesta },
          })),
        },
      ],
    },
  });

  return (
    <>
      <section className="heroe contenedor" aria-labelledby="titulo-sobre">
        <h1 id="titulo-sobre" className="heroe__titulo">
          AltairTrends: <span className="texto-acento">¡Alza vuelo con Altair!</span>
        </h1>
        <p className="heroe__texto">
          Donde las tendencias alzan vuelo.
          Tienda online colombiana inspirada en la visión del águila: clara, audaz y siempre a la vanguardia.
          Productos únicos y funcionales para quienes quieren destacar, desde Dosquebradas (Risaralda) para toda Colombia.
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

      {/* Preguntas frecuentes: respuesta directa en la primera frase de cada una. */}
      <section className="contenedor bloque" aria-labelledby="titulo-preguntas">
        <h2 id="titulo-preguntas" className="titulo-seccion">
          Preguntas frecuentes
        </h2>
        <div className="preguntas">
          {PREGUNTAS_FRECUENTES.map(({ pregunta, respuesta }) => (
            <div key={pregunta} className="preguntas__item">
              <h3 className="preguntas__pregunta">{pregunta}</h3>
              <p className="bloque__texto">{respuesta}</p>
            </div>
          ))}
        </div>
        <p className="bloque__texto">
          Los detalles completos están en los <a href="/terminos">Términos y Condiciones</a> y en la{' '}
          <a href="/privacidad">Política de datos</a>.
        </p>
      </section>
      {/* El botón "Contáctanos" se quitó: la sección Contacto está oculta. */}
    </>
  );
}
