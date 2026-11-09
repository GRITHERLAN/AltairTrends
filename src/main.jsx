// ============================================================
// main.jsx
// Punto de entrada: carga los estilos y monta React en #root.
//
// Las páginas públicas llegan ya pintadas en el HTML (prerenderizado del
// build, ver scripts/prerender.mjs), para buscadores y para que se vean al
// instante. En ese caso React se monta en un contenedor aparte, descarga los
// datos y, cuando está listo, cambia la página estática por la suya. Así no
// se ve "Cargando..." ni saltos de diseño.
// ============================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/componentes.css';
import './styles/paginas.css';
import './styles/responsive.css';

const raiz = document.getElementById('root');
const { pathname, hash } = window.location;

// El HTML estático solo sirve si es de ESTA URL. Cloudflare responde con la
// portada (index.html) a cualquier ruta sin archivo propio, y el login y el
// admin van en el hash: en esos casos se descarta y React pinta desde cero.
const prerenderValido = raiz.dataset.ruta === pathname && !hash;

let contenedor = raiz;
let alEstarListo;

if (prerenderValido) {
  contenedor = document.createElement('div');
  contenedor.id = 'root';
  alEstarListo = () => {
    if (contenedor.isConnected) return;
    raiz.replaceWith(contenedor);
  };
} else {
  raiz.replaceChildren();
  delete raiz.dataset.ruta;
}

createRoot(contenedor).render(
  <StrictMode>
    <App alEstarListo={alEstarListo} />
  </StrictMode>
);
