// ============================================================
// useRuta.jsx
// Mini-router propio basado en el hash de la URL (#/catalogo, #/producto/ALT-102...).
// Se hace a mano para no añadir dependencias externas (react-router).
// ============================================================

import { useEffect, useState } from 'react';

// Lee el hash actual y lo convierte en { nombre, parametro }.
function leerRuta() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const partes = hash.split('/').filter(Boolean); // '/producto/ALT-102' -> ['producto','ALT-102']

  if (partes.length === 0) return { nombre: 'inicio', parametro: null };
  if (partes[0] === 'producto' && partes[1]) return { nombre: 'producto', parametro: decodeURIComponent(partes[1]) };
  return { nombre: partes[0], parametro: null };
}

// Cambia de página desde el código (equivale a pulsar un enlace).
export function irA(ruta) {
  window.location.hash = ruta;
}

// Hook: devuelve la ruta actual y se actualiza cuando cambia el hash.
export function useRuta() {
  const [ruta, setRuta] = useState(leerRuta);

  useEffect(() => {
    function alCambiarHash() {
      setRuta(leerRuta());
      window.scrollTo(0, 0); // Cada página nueva empieza arriba.
    }
    window.addEventListener('hashchange', alCambiarHash);
    return () => window.removeEventListener('hashchange', alCambiarHash);
  }, []);

  return ruta;
}
