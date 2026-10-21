// ============================================================
// PaginaRegistro.jsx
// Registro de usuarios nuevos (siempre con rol "usuario").
// ============================================================

import { useState } from 'react';
import Campo from '../components/ui/Campo';
import { useAuth } from '../context/AuthContext';
import { useAvisos } from '../context/AvisosContext';
import { irA } from '../hooks/useRuta';
import { enlaceInterno } from '../utils/rutasCifradas';

export default function PaginaRegistro() {
  const { registrar } = useAuth();
  const { mostrarAviso } = useAvisos();
  const [datos, setDatos] = useState({ nombre: '', correo: '', contrasena: '', confirmar: '' });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  // Actualiza un campo y borra su error.
  function cambiar(campo, valor) {
    setDatos({ ...datos, [campo]: valor });
    setErrores({ ...errores, [campo]: undefined });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    // Validaciones del lado del cliente.
    const nuevos = {};
    if (datos.nombre.trim().length < 2) nuevos.nombre = 'Escribe tu nombre.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) nuevos.correo = 'Ingresa un correo válido.';
    if (datos.contrasena.length < 6) nuevos.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
    if (datos.confirmar !== datos.contrasena) nuevos.confirmar = 'Las contraseñas no coinciden.';

    if (Object.keys(nuevos).length > 0) {
      setErrores(nuevos);
      return;
    }

    setCargando(true);
    const resultado = await registrar(datos);
    setCargando(false);

    if (!resultado.ok) {
      setErrores(resultado.errores);
      return;
    }

    mostrarAviso('exito', `¡Cuenta creada! Bienvenido, ${resultado.usuario.nombre}.`);
    irA('/');
  }

  return (
    <section className="contenedor autenticacion" aria-labelledby="titulo-registro">
      <form className="formulario tarjeta-panel" onSubmit={manejarEnvio} noValidate>
        <h1 id="titulo-registro" className="formulario__titulo">
          Crear cuenta
        </h1>

        {errores.general && (
          <p className="mensaje mensaje--error" role="alert">
            {errores.general}
          </p>
        )}

        <Campo id="registro-nombre" etiqueta="Nombre completo" autoComplete="name" valor={datos.nombre} error={errores.nombre} onCambio={(e) => cambiar('nombre', e.target.value)} />
        <Campo id="registro-correo" tipo="email" etiqueta="Correo electrónico" autoComplete="email" valor={datos.correo} error={errores.correo} onCambio={(e) => cambiar('correo', e.target.value)} />
        <Campo id="registro-contrasena" tipo="password" etiqueta="Contraseña" autoComplete="new-password" valor={datos.contrasena} error={errores.contrasena} onCambio={(e) => cambiar('contrasena', e.target.value)} />
        <Campo id="registro-confirmar" tipo="password" etiqueta="Confirmar contraseña" autoComplete="new-password" valor={datos.confirmar} error={errores.confirmar} onCambio={(e) => cambiar('confirmar', e.target.value)} />

        <button type="submit" className="boton boton--primario" disabled={cargando}>
          {cargando ? 'Creando cuenta...' : 'Registrarme'}
        </button>

        <p className="formulario__pie">
          ¿Ya tienes cuenta? <a href={enlaceInterno('/login')}>Inicia sesión</a>
        </p>
      </form>
    </section>
  );
}
