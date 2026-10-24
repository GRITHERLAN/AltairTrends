// ============================================================
// PaginaLegal.jsx
// Muestra un documento legal (Política de privacidad, Términos y
// Condiciones o Política de cookies). Los textos están en data/legal.js;
// el correo y el teléfono del Responsable vienen de la configuración de
// Contacto que edita el administrador.
// ============================================================

import { useConfig } from '../context/ConfigContext';
import { DOCUMENTOS_LEGALES, FECHA_VIGENCIA, RESPONSABLE, VERSION_POLITICA } from '../data/legal';
import { enlaceInterno } from '../utils/rutasCifradas';

export default function PaginaLegal({ documento }) {
  const { config } = useConfig();
  const contenido = DOCUMENTOS_LEGALES[documento];

  return (
    <article className="contenedor legal" aria-labelledby="titulo-legal">
      <header className="legal__cabecera">
        <p className="etiqueta-seccion">Información legal</p>
        <h1 id="titulo-legal" className="titulo-seccion">
          {contenido.titulo}
        </h1>
        <p className="bloque__texto">{contenido.resumen}</p>
        <p className="legal__vigencia">
          Vigente desde el {FECHA_VIGENCIA} · Versión {VERSION_POLITICA}
        </p>
      </header>

      {/* Identificación del Responsable / proveedor: la exigen la Ley 1581 y la Ley 1480 */}
      <section className="legal__seccion tarjeta-panel" aria-labelledby="titulo-responsable">
        <h2 id="titulo-responsable" className="legal__subtitulo">
          Quién está a cargo de la tienda y de tus datos
        </h2>
        <dl className="legal__datos">
          <div>
            <dt>Nombre</dt>
            <dd>
              {RESPONSABLE.nombre} (persona natural), titular de la marca {RESPONSABLE.marca}
            </dd>
          </div>
          <div>
            <dt>Ciudad</dt>
            <dd>
              {RESPONSABLE.ciudad}
            </dd>
          </div>
          <div>
            <dt>Correo electrónico</dt>
            <dd>
              <a href={`mailto:${config.correo}`}>{config.correo}</a>
            </dd>
          </div>
          <div>
            <dt>Teléfono</dt>
            <dd>
              <a href={`tel:${config.telefono.replace(/\s/g, '')}`}>{config.telefono}</a>
            </dd>
          </div>
        </dl>
      </section>

      {contenido.secciones.map((seccion) => (
        <section key={seccion.titulo} className="legal__seccion">
          <h2 className="legal__subtitulo">{seccion.titulo}</h2>
          {(seccion.parrafos ?? []).map((parrafo) => (
            <p key={parrafo} className="bloque__texto">
              {parrafo}
            </p>
          ))}
          {seccion.lista && (
            <ul className="legal__lista">
              {seccion.lista.map((elemento) => (
                <li key={elemento}>{elemento}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {/* Enlaces a los otros dos documentos */}
      <nav className="legal__otros" aria-label="Otros documentos legales">
        {Object.entries(DOCUMENTOS_LEGALES)
          .filter(([nombre]) => nombre !== documento)
          .map(([nombre, otro]) => (
            <a key={nombre} className="boton boton--secundario" href={enlaceInterno(otro.ruta)}>
              {otro.titulo}
            </a>
          ))}
      </nav>
    </article>
  );
}
