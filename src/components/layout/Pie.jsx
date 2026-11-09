// ============================================================
// Pie.jsx
// Pie de página con datos de contacto (vienen del panel de administración)
// y enlaces a los documentos legales.
// ============================================================

import { useConfig } from '../../context/ConfigContext';
import { DOCUMENTOS_LEGALES, RESPONSABLE } from '../../data/legal';
import { enlaceInterno } from '../../utils/rutasCifradas';
import Marca from '../ui/Marca';

export default function Pie() {
  const { config } = useConfig();

  return (
    <footer className="pie">
      <div className="pie__contenido contenedor">
        <div className="pie__marca">
          <Marca />
          <p className="pie__texto">Tienda online de productos para el hogar, juguetes y más. Desde Dosquebradas para toda Colombia.</p>
        </div>

        <address className="pie__contacto">
          <p>
            <a href={`mailto:${config.correo}`}>{config.correo}</a>
          </p>
          <p>
            <a href={`tel:${config.telefono.replace(/\s/g, '')}`}>{config.telefono}</a>
          </p>
        </address>

        <nav className="pie__documentos" aria-label="Documentos legales">
          <ul className="pie__documentos-lista">
            {Object.values(DOCUMENTOS_LEGALES).map((documento) => (
              <li key={documento.ruta}>
                <a href={enlaceInterno(documento.ruta)}>{documento.titulo}</a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="pie__legal">
          {/* Los derechos son de la persona responsable: AltairTrends es solo su nombre comercial (sin registrar). */}
          © {new Date().getFullYear()} {RESPONSABLE.nombre} · {RESPONSABLE.marca}. Todos los derechos reservados. Precios
          expresados en Pesos Colombianos (COP).
        </p>

        <p className="pie__legal">
          Desarrollado y diseñado por{' '}
          <a href="https://www.gritherweb.com" target="_blank" rel="noopener noreferrer">
            Grither
          </a>
        </p>
      </div>
    </footer>
  );
}
