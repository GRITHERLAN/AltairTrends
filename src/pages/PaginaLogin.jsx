// ============================================================
// PaginaLogin.jsx
// Inicio de sesión con Supabase Auth (roles Administrador y Usuario).
// Las cuentas se crean desde el panel de Supabase; por seguridad, aquí
// no se muestra ninguna credencial.
//
// Contra ataques de fuerza bruta: tras 5 intentos fallidos seguidos el
// formulario se bloquea 60 segundos. Es una primera barrera en el
// navegador; la protección real son los límites de intentos de Supabase Auth.
// ============================================================

import { useState } from 'react';
import Campo from '../components/ui/Campo';
import { useAuth } from '../context/AuthContext';
import { useAvisos } from '../context/AvisosContext';
import { irA } from '../hooks/useRuta';

// Intentos fallidos permitidos antes de bloquear y duración del bloqueo.
const MAXIMO_INTENTOS = 5;
const SEGUNDOS_BLOQUEO = 60;

export default function PaginaLogin() {
  const { entrar } = useAuth();
  const { mostrarAviso } = useAvisos();
  const [datos, setDatos] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  // Momento (en milisegundos) hasta el que el formulario queda bloqueado; 0 = sin bloqueo.
  const [bloqueadoHasta, setBloqueadoHasta] = useState(0);

  async function manejarEnvio(evento) {
    evento.preventDefault();

    // Bloqueo temporal por demasiados intentos fallidos.
    const segundosRestantes = Math.ceil((bloqueadoHasta - Date.now()) / 1000);
    if (segundosRestantes > 0) {
      setError(`Demasiados intentos fallidos. Espera ${segundosRestantes} segundos e inténtalo de nuevo.`);
      return;
    }

    if (datos.correo.trim() === '' || datos.contrasena === '') {
      setError('Ingresa tu correo y tu contraseña.');
      return;
    }

    setCargando(true);
    const resultado = await entrar(datos);
    setCargando(false);

    if (!resultado.ok) {
      const intentos = intentosFallidos + 1;
      if (intentos >= MAXIMO_INTENTOS) {
        setBloqueadoHasta(Date.now() + SEGUNDOS_BLOQUEO * 1000);
        setIntentosFallidos(0);
        setError(`Demasiados intentos fallidos. Espera ${SEGUNDOS_BLOQUEO} segundos e inténtalo de nuevo.`);
      } else {
        setIntentosFallidos(intentos);
        setError(resultado.error);
      }
      // Por seguridad, la contraseña escrita se borra tras un intento fallido.
      setDatos({ ...datos, contrasena: '' });
      return;
    }

    mostrarAviso('exito', `¡Bienvenido, ${resultado.usuario.nombre}!`);
    // El administrador va directo a su panel; el usuario, al catálogo.
    irA(resultado.usuario.rol === 'admin' ? '/admin' : '/');
  }

  return (
    <section className="contenedor autenticacion" aria-labelledby="titulo-login">
      <form className="formulario tarjeta-panel" onSubmit={manejarEnvio} noValidate>
        <h1 id="titulo-login" className="formulario__titulo">
          Iniciar sesión
        </h1>

        {error && (
          <p className="mensaje mensaje--error" role="alert">
            {error}
          </p>
        )}

        {/* 72 caracteres: el máximo que tiene en cuenta el hash bcrypt de Supabase Auth */}
        <Campo id="login-correo" tipo="email" etiqueta="Correo electrónico" autoComplete="email" maxLength={120} valor={datos.correo} onCambio={(e) => setDatos({ ...datos, correo: e.target.value })} />
        <Campo id="login-contrasena" tipo="password" etiqueta="Contraseña" autoComplete="current-password" maxLength={72} valor={datos.contrasena} onCambio={(e) => setDatos({ ...datos, contrasena: e.target.value })} />

        <button type="submit" className="boton boton--primario" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </section>
  );
}
