// ============================================================
// Pie.jsx
// Pie de página con datos de contacto (vienen del panel de administración).
// ============================================================

import { useConfig } from '../../context/ConfigContext';
import Marca from '../ui/Marca';

export default function Pie() {
  const { config } = useConfig();

  return (
    <footer className="pie">
      <div className="pie__contenido contenedor">
        <div className="pie__marca">
          <Marca />
          <p className="pie__texto">Tienda contemporánea de lujo accesible en Colombia.</p>
        </div>

        <address className="pie__contacto">
          <p>
            <a href={`mailto:${config.correo}`}>{config.correo}</a>
          </p>
          <p>
            <a href={`tel:${config.telefono.replace(/\s/g, '')}`}>{config.telefono}</a>
          </p>
        </address>

        <p className="pie__legal">
          © {new Date().getFullYear()} AltairTrends Luxury Digital. Todos los derechos reservados. Precios expresados en
          Pesos Colombianos (COP).
        </p>
      </div>
    </footer>
  );
}
