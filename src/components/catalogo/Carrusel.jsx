// ============================================================
// Carrusel.jsx
// Carrusel de imágenes y videos con flechas, miniaturas y teclado (← →).
// Si no hay multimedia muestra el marcador con el logo.
// ============================================================

import { useState } from 'react';
import MediaProducto from './MediaProducto';

export default function Carrusel({ multimedia, nombre }) {
  // Posición (índice) del elemento que se está viendo.
  const [indice, setIndice] = useState(0);
  const total = multimedia.length;

  // Avanza o retrocede de forma circular (después del último vuelve al primero).
  function mover(paso, evento) {
    if (evento) evento.preventDefault();
    setIndice((actual) => (actual + paso + total) % total);
  }

  // Permite navegar con las flechas del teclado cuando el carrusel tiene el foco.
  function alPulsarTecla(evento) {
    if (total < 2) return;
    if (evento.key === 'ArrowLeft') mover(-1, evento);
    if (evento.key === 'ArrowRight') mover(1, evento);
  }

  return (
    <section className="carrusel" aria-label={`Galería de ${nombre}`} tabIndex={0} onKeyDown={alPulsarTecla}>
      <div className="carrusel__principal">
        {/* "key" fuerza a recrear el video/imagen al cambiar de elemento */}
        <MediaProducto key={indice} medio={multimedia[indice]} nombre={nombre} controles />

        {total > 1 && (
          <>
            <button type="button" className="carrusel__flecha carrusel__flecha--izq" onClick={(e) => mover(-1, e)} aria-label="Elemento anterior">
              ‹
            </button>
            <button type="button" className="carrusel__flecha carrusel__flecha--der" onClick={(e) => mover(1, e)} aria-label="Elemento siguiente">
              ›
            </button>
            <p className="carrusel__contador">
              {indice + 1} / {total}
            </p>
          </>
        )}
      </div>

      {total > 1 && (
        <ul className="carrusel__miniaturas">
          {multimedia.map((medio, posicion) => (
            <li key={posicion}>
              <button
                type="button"
                className={`carrusel__miniatura ${posicion === indice ? 'carrusel__miniatura--activa' : ''}`}
                onClick={(evento) => {
                  evento.preventDefault();
                  setIndice(posicion);
                }}
                aria-label={`Ver elemento ${posicion + 1}`}
                aria-current={posicion === indice}
              >
                {medio.tipo === 'video' ? <span className="carrusel__video-icono">▶ Video</span> : <img src={medio.url} alt="" loading="lazy" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
