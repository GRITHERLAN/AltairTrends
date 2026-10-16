// ============================================================
// Marca.jsx
// Logo + nombre "AltairTrends". Las letras van en dorado (color del logo).
// ============================================================

import logo from '../../assets/logo.png';

export default function Marca({ sufijo = '' }) {
  return (
    <a className="marca" href="#/" aria-label="AltairTrends, ir al inicio">
      <img className="marca__logo" src={logo} alt="" />
      <span className="marca__nombre">
        Altair<span className="marca__nombre-trends">Trends</span>
        {sufijo && <span className="marca__sufijo"> {sufijo}</span>}
      </span>
    </a>
  );
}
