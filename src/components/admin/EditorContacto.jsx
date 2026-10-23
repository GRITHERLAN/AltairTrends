// ============================================================
// EditorContacto.jsx
// Edición (solo Administrador) de correo, teléfono, descripción de
// marca e indicadores. Los cambios se guardan en Supabase y se reflejan
// en la web pública.
// ============================================================

import { useState } from 'react';
import { useAvisos } from '../../context/AvisosContext';
import { useConfig } from '../../context/ConfigContext';
import { LIMITES_INDICADOR } from '../../services/configService';
import Campo from '../ui/Campo';

export default function EditorContacto() {
  const { config, actualizarConfig } = useConfig();
  const { mostrarAviso } = useAvisos();
  const [datos, setDatos] = useState(config);
  const [errores, setErrores] = useState({});
  // true mientras se espera la respuesta de Supabase (desactiva el botón Guardar).
  const [guardando, setGuardando] = useState(false);

  // Cambia un indicador concreto (por posición) y un campo suyo (valor, etiqueta, detalle).
  function cambiarIndicador(posicion, campo, valor) {
    const indicadores = datos.indicadores.map((indicador, i) => (i === posicion ? { ...indicador, [campo]: valor } : indicador));
    setDatos({ ...datos, indicadores });
    setErrores({ ...errores, indicadores: undefined });
  }

  // Agrega un indicador vacío al final de la lista (no hay límite de cantidad).
  function agregarIndicador() {
    const indicadores = [...datos.indicadores, { valor: '', etiqueta: '', detalle: '' }];
    setDatos({ ...datos, indicadores });
    setErrores({ ...errores, indicadores: undefined });
  }

  // Quita el indicador que está en la posición indicada (se puede llegar a cero indicadores).
  function quitarIndicador(posicion) {
    const indicadores = datos.indicadores.filter((_, i) => i !== posicion);
    setDatos({ ...datos, indicadores });
    setErrores({ ...errores, indicadores: undefined });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setGuardando(true);
    const resultado = await actualizarConfig(datos);
    setGuardando(false);

    if (!resultado.ok) {
      setErrores(resultado.errores);
      mostrarAviso('error', 'Revisa los campos marcados antes de guardar.');
      return;
    }
    // Se refleja en el formulario la lista ya limpia (sin las filas vacías que se descartaron).
    setDatos(resultado.config);
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
          {/* maxLength: los mismos límites que valida la base de datos */}
          <Campo id="config-correo" tipo="email" etiqueta="Correo electrónico" maxLength={120} valor={datos.correo} error={errores.correo} onCambio={(e) => setDatos({ ...datos, correo: e.target.value })} />
          <Campo id="config-telefono" tipo="tel" etiqueta="Teléfono" maxLength={30} valor={datos.telefono} error={errores.telefono} onCambio={(e) => setDatos({ ...datos, telefono: e.target.value })} />
        </div>

        <Campo id="config-descripcion" tipo="textarea" etiqueta="Descripción de marca" maxLength={3000} valor={datos.descripcion} error={errores.descripcion} onCambio={(e) => setDatos({ ...datos, descripcion: e.target.value })} />

        <fieldset className="indicadores-editor">
          <legend className="campo__etiqueta">Indicadores</legend>
          {errores.indicadores && (
            <p className="campo__error" role="alert">
              {errores.indicadores}
            </p>
          )}
          {/* Sin indicadores: se avisa al administrador en lugar de dejar la card vacía */}
          {datos.indicadores.length === 0 && <p className="indicadores-editor__vacio">Aún no hay indicadores. Usa el botón "Agregar indicador" para crear el primero.</p>}
          {datos.indicadores.map((indicador, posicion) => (
            <div key={posicion} className="indicadores-editor__fila">
              <Campo id={`indicador-valor-${posicion}`} etiqueta={`Indicador ${posicion + 1}: valor`} maxLength={LIMITES_INDICADOR.valor} valor={indicador.valor} onCambio={(e) => cambiarIndicador(posicion, 'valor', e.target.value)} />
              <Campo id={`indicador-etiqueta-${posicion}`} etiqueta="Nombre" maxLength={LIMITES_INDICADOR.etiqueta} valor={indicador.etiqueta} onCambio={(e) => cambiarIndicador(posicion, 'etiqueta', e.target.value)} />
              <Campo id={`indicador-detalle-${posicion}`} etiqueta="Detalle" maxLength={LIMITES_INDICADOR.detalle} valor={indicador.detalle} onCambio={(e) => cambiarIndicador(posicion, 'detalle', e.target.value)} />
              {/* type="button" para que no envíe el formulario */}
              <button type="button" className="boton boton--peligro boton--pequeno indicadores-editor__quitar" aria-label={`Quitar indicador ${posicion + 1}`} onClick={() => quitarIndicador(posicion)}>
                Quitar
              </button>
            </div>
          ))}
          <button type="button" className="boton boton--secundario boton--pequeno indicadores-editor__agregar" onClick={agregarIndicador}>
            Agregar indicador
          </button>
        </fieldset>

        <button type="submit" className="boton boton--primario" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar información'}
        </button>
      </form>
    </section>
  );
}
