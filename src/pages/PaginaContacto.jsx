// ============================================================
// PaginaContacto.jsx
// Datos de contacto (editables por el admin) + formulario de mensaje.
// El mensaje se envía a Supabase, que lo guarda CIFRADO (solo lo lee el
// Administrador), y la confirmación se ve en pantalla.
//
// Protección de datos y anti-bots:
//   - Casilla de autorización obligatoria y SIN marcar por defecto (Ley 1581 de 2012).
//   - Campo trampa ("honeypot") oculto: las personas no lo ven; los bots lo rellenan.
// ============================================================

import { useState } from 'react';
import Campo from '../components/ui/Campo';
import { useConfig } from '../context/ConfigContext';
import { LIMITES_MENSAJE, guardarMensajeContacto, validarMensajeContacto } from '../services/configService';
import { enlaceInterno } from '../utils/rutasCifradas';

const FORMULARIO_VACIO = { nombre: '', correo: '', mensaje: '', aceptaPolitica: false, trampa: '' };

export default function PaginaContacto() {
  const { config } = useConfig();
  const [datos, setDatos] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  // true mientras se envía el mensaje a Supabase.
  const [enviando, setEnviando] = useState(false);

  // Actualiza un campo y limpia su error al escribir.
  function cambiar(campo, valor) {
    setDatos({ ...datos, [campo]: valor });
    setErrores({ ...errores, [campo]: undefined });
    setEnviado(false);
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    // 1) Validación de FrontEnd (los mismos límites que vuelve a comprobar el servidor).
    const nuevos = validarMensajeContacto(datos);
    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos);
      return;
    }

    // 2) Envío: el servidor valida otra vez, aplica los límites anti-bots y cifra el mensaje.
    setEnviando(true);
    const resultado = await guardarMensajeContacto(datos);
    setEnviando(false);
    if (!resultado.ok) {
      setErrores(resultado.errores);
      return;
    }
    setDatos(FORMULARIO_VACIO);
    setErrores({});
    setEnviado(true);
  }

  return (
    <section className="contenedor contacto" aria-labelledby="titulo-contacto">
      <p className="etiqueta-seccion">Atención al Cliente</p>
      <h1 id="titulo-contacto" className="titulo-seccion">
        Estamos aquí para ayudarte
      </h1>

      <div className="contacto__rejilla">
        <div className="contacto__datos">
          <p className="bloque__texto">
            En AltairTrends queremos ofrecerte la mejor experiencia de compra. Si tienes preguntas sobre nuestros productos, 
            pedidos o necesitas ayuda, estamos aquí para atenderte.
          </p>
          <ul className="contacto__lista">
            <li className="contacto__dato">
              <span className="contacto__dato-etiqueta">Correo oficial</span>
              <a href={`mailto:${config.correo}`}>{config.correo}</a>
            </li>
            <li className="contacto__dato">
              <span className="contacto__dato-etiqueta">Línea directa / WhatsApp</span>
              <a href={`tel:${config.telefono.replace(/\s/g, '')}`}>{config.telefono}</a>
            </li>
          </ul>
        </div>

        <form className="formulario tarjeta-panel" onSubmit={manejarEnvio} noValidate>
          <h2 className="formulario__titulo">Envíanos un mensaje</h2>

          {enviado && (
            <p className="mensaje mensaje--exito" role="status">
              ¡Gracias! Recibimos tu mensaje y te responderemos muy pronto.
            </p>
          )}
          {errores.general && (
            <p className="mensaje mensaje--error" role="alert">
              {errores.general}
            </p>
          )}

          <Campo id="contacto-nombre" etiqueta="Nombre" autoComplete="name" maxLength={LIMITES_MENSAJE.nombre} valor={datos.nombre} error={errores.nombre} onCambio={(e) => cambiar('nombre', e.target.value)} />
          <Campo id="contacto-correo" tipo="email" etiqueta="Correo electrónico" autoComplete="email" maxLength={LIMITES_MENSAJE.correo} valor={datos.correo} error={errores.correo} onCambio={(e) => cambiar('correo', e.target.value)} />
          <Campo id="contacto-mensaje" tipo="textarea" etiqueta="Mensaje" maxLength={LIMITES_MENSAJE.mensaje} valor={datos.mensaje} error={errores.mensaje} onCambio={(e) => cambiar('mensaje', e.target.value)} />

          {/* Campo trampa (honeypot): fuera de la vista, del teclado y de los lectores de pantalla.
              Una persona nunca lo rellena; si llega con texto, el servidor descarta el mensaje. */}
          <div className="trampa" aria-hidden="true">
            <label htmlFor="contacto-sitio-web">Sitio web</label>
            <input id="contacto-sitio-web" type="text" tabIndex={-1} autoComplete="off" value={datos.trampa} onChange={(e) => cambiar('trampa', e.target.value)} />
          </div>

          {/* Autorización previa, expresa e informada: empieza SIN marcar (el silencio no es autorización) */}
          <div className={`campo ${errores.aceptaPolitica ? 'campo--error' : ''}`}>
            <label className="casilla casilla--legal" htmlFor="contacto-autorizacion">
              <input
                id="contacto-autorizacion"
                type="checkbox"
                checked={datos.aceptaPolitica}
                aria-invalid={errores.aceptaPolitica ? true : undefined}
                aria-describedby={errores.aceptaPolitica ? 'contacto-autorizacion-error' : undefined}
                onChange={(e) => cambiar('aceptaPolitica', e.target.checked)}
              />
              <span>
                Autorizo a AltairTrends a tratar mis datos personales (nombre, correo y mensaje) para responder mi solicitud, según la{' '}
                <a href={enlaceInterno('/privacidad')} target="_blank" rel="noopener">
                  Política de Tratamiento de Datos Personales
                </a>
                .
              </span>
            </label>
            {errores.aceptaPolitica && (
              <p id="contacto-autorizacion-error" className="campo__error" role="alert">
                {errores.aceptaPolitica}
              </p>
            )}
          </div>

          <button type="submit" className="boton boton--primario" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      </div>
    </section>
  );
}
