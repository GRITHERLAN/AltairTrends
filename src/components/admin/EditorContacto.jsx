// ============================================================
// EditorContacto.jsx
// Edición (solo Administrador) de correo, teléfono, descripción de
// marca e indicadores. Los cambios se reflejan en la web pública.
// ============================================================

import { useState } from 'react';
import { useAvisos } from '../../context/AvisosContext';
import { useConfig } from '../../context/ConfigContext';
import Campo from '../ui/Campo';

export default function EditorContacto() {
  const { config, actualizarConfig } = useConfig();
  const { mostrarAviso } = useAvisos();
  const [datos, setDatos] = useState(config);
  const [errores, setErrores] = useState({});

  // Cambia un indicador concreto (por posición) y un campo suyo (valor, etiqueta, detalle).
  function cambiarIndicador(posicion, campo, valor) {
    const indicadores = datos.indicadores.map((indicador, i) => (i === posicion ? { ...indicador, [campo]: valor } : indicador));
    setDatos({ ...datos, indicadores });
    setErrores({ ...errores, indicadores: undefined });
  }

  function manejarEnvio(evento) {
    evento.preventDefault();
    const resultado = actualizarConfig(datos);

    if (!resultado.ok) {
      setErrores(resultado.errores);
      mostrarAviso('error', 'Revisa los campos marcados antes de guardar.');
      return;
    }
    setErrores({});
    mostrarAviso('exito', 'Información de contacto guardada correctamente.');
  }

  return (
    <section className="tarjeta-panel" aria-labelledby="titulo-config">
      <header className="panel__cabecera">
        <div>
          <h2 id="titulo-config" className="titulo-seccion titulo-seccion--pequeno">
            Información de contacto e indicadores
          </h2>
          <p className="catalogo__subtitulo">Estos datos se muestran en "Sobre nosotros", "Contacto" y el pie de página.</p>
        </div>
        <span className="insignia insignia--dorada">Solo administrador</span>
      </header>

      <form className="formulario" onSubmit={manejarEnvio} noValidate>
        {errores.general && (
          <p className="mensaje mensaje--error" role="alert">
            {errores.general}
          </p>
        )}

        <div className="formulario__rejilla">
          <Campo id="config-correo" tipo="email" etiqueta="Correo electrónico" valor={datos.correo} error={errores.correo} onCambio={(e) => setDatos({ ...datos, correo: e.target.value })} />
          <Campo id="config-telefono" tipo="tel" etiqueta="Teléfono" valor={datos.telefono} error={errores.telefono} onCambio={(e) => setDatos({ ...datos, telefono: e.target.value })} />
        </div>

        <Campo id="config-descripcion" tipo="textarea" etiqueta="Descripción de marca" valor={datos.descripcion} error={errores.descripcion} onCambio={(e) => setDatos({ ...datos, descripcion: e.target.value })} />

        <fieldset className="indicadores-editor">
          <legend className="campo__etiqueta">Indicadores</legend>
          {errores.indicadores && (
            <p className="campo__error" role="alert">
              {errores.indicadores}
            </p>
          )}
          {datos.indicadores.map((indicador, posicion) => (
            <div key={posicion} className="indicadores-editor__fila">
              <Campo id={`indicador-valor-${posicion}`} etiqueta={`Indicador ${posicion + 1}: valor`} valor={indicador.valor} onCambio={(e) => cambiarIndicador(posicion, 'valor', e.target.value)} />
              <Campo id={`indicador-etiqueta-${posicion}`} etiqueta="Nombre" valor={indicador.etiqueta} onCambio={(e) => cambiarIndicador(posicion, 'etiqueta', e.target.value)} />
              <Campo id={`indicador-detalle-${posicion}`} etiqueta="Detalle" valor={indicador.detalle} onCambio={(e) => cambiarIndicador(posicion, 'detalle', e.target.value)} />
            </div>
          ))}
        </fieldset>

        <button type="submit" className="boton boton--primario">
          Guardar información
        </button>
      </form>
    </section>
  );
}
