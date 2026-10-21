// ============================================================
// useRuta.jsx
// Mini-router propio basado en el hash de la URL.
// La ruta va cifrada: el hash es algo como "#/k9Fz3x..." y se descifra al leerlo
// (ver src/utils/rutasCifradas.js). Por dentro la ruta sigue siendo "/producto/ALT-102".
// Se hace a mano para no añadir dependencias externas (react-router).
// ============================================================

import { useEffect, useState } from 'react';
import { descifrarRuta, enlaceInterno } from '../utils/rutasCifradas';

// Lee el hash actual, lo descifra y lo convierte en { nombre, parametro }.
function leerRuta() {
  // Quitamos el "#" y la "/" inicial. Lo que queda es el token cifrado (vacío = inicio).
  const token = window.location.hash.replace(/^#\/?/, '');
  const ruta = descifrarRuta(token);

  // Si el token no es válido (URL vieja sin cifrar o texto cualquiera), mostramos el catálogo.
  if (ruta === null) return { nombre: 'inicio', parametro: null };

  const partes = ruta.split('/').filter(Boolean); // '/producto/ALT-102' -> ['producto','ALT-102']

  if (partes.length === 0) return { nombre: 'inicio', parametro: null };
  if (partes[0] === 'producto' && partes[1]) return { nombre: 'producto', parametro: decodeURIComponent(partes[1]) };
  return { nombre: partes[0], parametro: null };
}

// Cambia de página desde el código (equivale a pulsar un enlace).
// Recibe la ruta en claro, por ejemplo irA('/login'), y la cifra antes de mostrarla.
export function irA(ruta) {
  window.location.hash = enlaceInterno(ruta);
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
