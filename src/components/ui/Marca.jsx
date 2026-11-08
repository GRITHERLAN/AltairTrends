// ============================================================
// Marca.jsx
// Logo + nombre "AltairTrends". Las letras van en dorado (color del logo).
// ============================================================

import logo from '../../assets/logo.webp';

export default function Marca({ sufijo = '' }) {
  return (
    <a className="marca" href="/" aria-label="AltairTrends, ir al inicio">
      {/* width/height reservan el espacio antes de que cargue (evita saltos de diseño, CLS) */}
      <img className="marca__logo" src={logo} alt="" width="169" height="220" />
      <span className="marca__nombre">
        Altair<span className="marca__nombre-trends">Trends</span>
        {sufijo && <span className="marca__sufijo"> {sufijo}</span>}
      </span>
    </a>
  );
}
