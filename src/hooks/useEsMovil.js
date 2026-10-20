// ============================================================
// useEsMovil.js
// Indica si la pantalla es de celular (640px de ancho o menos).
// Se actualiza solo si el usuario gira el teléfono o cambia el tamaño de la ventana.
// ============================================================

import { useEffect, useState } from 'react';

// Se escribe en px (y no en rem) porque en las media queries el rem NO usa el
// font-size de 10px de la web, sino el del navegador (16px).
const CONSULTA_MOVIL = '(max-width: 640px)';

export function useEsMovil() {
  // Valor inicial: lo que dice el navegador en este momento.
  const [esMovil, setEsMovil] = useState(() => window.matchMedia(CONSULTA_MOVIL).matches);

  useEffect(() => {
    const consulta = window.matchMedia(CONSULTA_MOVIL);
    function alCambiar(evento) {
      setEsMovil(evento.matches);
    }
    consulta.addEventListener('change', alCambiar);
    return () => consulta.removeEventListener('change', alCambiar);
  }, []);

  return esMovil;
}
