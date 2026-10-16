// ============================================================
// main.jsx
// Punto de entrada: carga los estilos y monta React en #root.
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
