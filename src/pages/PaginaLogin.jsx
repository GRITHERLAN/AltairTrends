// ============================================================
// PaginaLogin.jsx
// Inicio de sesión. Muestra las credenciales de prueba del administrador.
// ============================================================

import { useState } from 'react';
import Campo from '../components/ui/Campo';
import { useAuth } from '../context/AuthContext';
import { useAvisos } from '../context/AvisosContext';
import { ADMIN_SEMILLA } from '../services/usuariosService';

export default function PaginaLogin() {
  const { entrar } = useAuth();
  const { mostrarAviso } = useAvisos();
  const [datos, setDatos] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();

    if (datos.correo.trim() === '' || datos.contrasena === '') {
      setError('Ingresa tu correo y tu contraseña.');
      return;
    }

    setCargando(true);
    const resultado = await entrar(datos);
    setCargando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    mostrarAviso('exito', `¡Bienvenido, ${resultado.usuario.nombre}!`);
    // El administrador va directo a su panel; el usuario, al catálogo.
    window.location.hash = resultado.usuario.rol === 'admin' ? '/admin' : '/';
  }

  // Rellena el formulario con las credenciales de prueba del admin.
  function usarCredencialesAdmin(evento) {
    evento.preventDefault();
    setDatos({ correo: ADMIN_SEMILLA.correo, contrasena: ADMIN_SEMILLA.contrasena });
    setError('');
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

        <Campo id="login-correo" tipo="email" etiqueta="Correo electrónico" autoComplete="email" valor={datos.correo} onCambio={(e) => setDatos({ ...datos, correo: e.target.value })} />
        <Campo id="login-contrasena" tipo="password" etiqueta="Contraseña" autoComplete="current-password" valor={datos.contrasena} onCambio={(e) => setDatos({ ...datos, contrasena: e.target.value })} />

        <button type="submit" className="boton boton--primario" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="formulario__pie">
          ¿No tienes cuenta? <a href="#/registro">Regístrate</a>
        </p>

        <aside className="nota">
          <p className="nota__titulo">Acceso de administrador (prueba)</p>
          <p>
            Correo: <strong>{ADMIN_SEMILLA.correo}</strong>
          </p>
          <p>
            Contraseña: <strong>{ADMIN_SEMILLA.contrasena}</strong>
          </p>
          <button type="button" className="boton boton--enlace" onClick={usarCredencialesAdmin}>
            Rellenar automáticamente
          </button>
        </aside>
      </form>
    </section>
  );
}
