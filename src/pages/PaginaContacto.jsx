// ============================================================
// PaginaContacto.jsx
// Datos de contacto (editables por el admin) + formulario de mensaje.
// El mensaje se guarda en LocalStorage y la confirmación se ve en pantalla.
// ============================================================

import { useState } from 'react';
import Campo from '../components/ui/Campo';
import { useConfig } from '../context/ConfigContext';
import { guardarMensajeContacto } from '../services/configService';

const FORMULARIO_VACIO = { nombre: '', correo: '', mensaje: '' };

export default function PaginaContacto() {
  const { config } = useConfig();
  const [datos, setDatos] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  // Actualiza un campo y limpia su error al escribir.
  function cambiar(campo, valor) {
    setDatos({ ...datos, [campo]: valor });
    setErrores({ ...errores, [campo]: undefined });
    setEnviado(false);
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    // Validaciones del formulario.
    const nuevos = {};
    if (datos.nombre.trim() === '') nuevos.nombre = 'Escribe tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) nuevos.correo = 'Ingresa un correo válido.';
    if (datos.mensaje.trim().length < 10) nuevos.mensaje = 'El mensaje debe tener al menos 10 caracteres.';

    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos);
      return;
    }

    const resultado = guardarMensajeContacto(datos);
    if (!resultado.ok) {
      setErrores({ general: resultado.error });
      return;
    }
    setDatos(FORMULARIO_VACIO);
    setErrores({});
    setEnviado(true);
  }

  return (
    <section className="contenedor contacto" aria-labelledby="titulo-contacto">
      <p className="etiqueta-seccion">Atención personalizada</p>
      <h1 id="titulo-contacto" className="titulo-seccion">
        Comunícate Directamente con Nosotros
      </h1>

      <div className="contacto__rejilla">
        <div className="contacto__datos">
          <p className="bloque__texto">
            Nuestro equipo de concierges y curadores está listo para asesorarte en adquisiciones, pedidos especiales o
            consultas generales.
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

          <Campo id="contacto-nombre" etiqueta="Nombre" valor={datos.nombre} error={errores.nombre} onCambio={(e) => cambiar('nombre', e.target.value)} />
          <Campo id="contacto-correo" tipo="email" etiqueta="Correo electrónico" valor={datos.correo} error={errores.correo} onCambio={(e) => cambiar('correo', e.target.value)} />
          <Campo id="contacto-mensaje" tipo="textarea" etiqueta="Mensaje" valor={datos.mensaje} error={errores.mensaje} onCambio={(e) => cambiar('mensaje', e.target.value)} />

          <button type="submit" className="boton boton--primario">
            Enviar mensaje
          </button>
        </form>
      </div>
    </section>
  );
}
