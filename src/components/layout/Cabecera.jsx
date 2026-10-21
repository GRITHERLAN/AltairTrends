// ============================================================
// Cabecera.jsx
// Encabezado con logo, navegación principal y zona de sesión.
// En pantallas pequeñas la navegación se abre con un botón (menú hamburguesa).
// ============================================================

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAvisos } from '../../context/AvisosContext';
import Marca from '../ui/Marca';
import { irA } from '../../hooks/useRuta';
import { enlaceInterno } from '../../utils/rutasCifradas';

// Enlaces públicos de la navegación.
const ENLACES = [
  { ruta: '/', nombre: 'inicio', texto: 'Catálogo' },
  { ruta: '/sobre-nosotros', nombre: 'sobre-nosotros', texto: 'Sobre nosotros' },
  { ruta: '/contacto', nombre: 'contacto', texto: 'Contacto' },
];

export default function Cabecera({ rutaActual }) {
  const { usuario, esAdmin, salir } = useAuth();
  const { mostrarAviso } = useAvisos();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Cierra sesión y avisa visualmente.
  function manejarSalir(evento) {
    evento.preventDefault();
    salir();
    setMenuAbierto(false);
    mostrarAviso('info', 'Has cerrado sesión correctamente.');
    irA('/');
  }

  // Devuelve la clase del enlace; marca como activo el de la página actual.
  function claseEnlace(nombre) {
    const activo = rutaActual === nombre || (nombre === 'inicio' && rutaActual === 'producto');
    return `cabecera__enlace ${activo ? 'cabecera__enlace--activo' : ''}`;
  }

  return (
    <header className="cabecera">
      <div className="cabecera__contenido contenedor">
        <Marca />

        <button
          type="button"
          className="cabecera__menu-boton"
          aria-expanded={menuAbierto}
          aria-controls="navegacion-principal"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? 'Cerrar' : 'Menú'}
        </button>

        <nav
          id="navegacion-principal"
          className={`cabecera__nav ${menuAbierto ? 'cabecera__nav--abierta' : ''}`}
          aria-label="Navegación principal"
        >
          <ul className="cabecera__lista">
            {ENLACES.map((enlace) => (
              <li key={enlace.ruta}>
                <a className={claseEnlace(enlace.nombre)} href={enlaceInterno(enlace.ruta)} onClick={() => setMenuAbierto(false)}>
                  {enlace.texto}
                </a>
              </li>
            ))}
            {esAdmin && (
              <li>
                <a className={claseEnlace('admin')} href={enlaceInterno('/admin')} onClick={() => setMenuAbierto(false)}>
                  Panel Admin
                </a>
              </li>
            )}
          </ul>

          <div className="cabecera__sesion">
            {usuario ? (
              <>
                <span className="cabecera__usuario">
                  Hola, {usuario.nombre.split(' ')[0]}
                  {esAdmin && <span className="insignia insignia--dorada">Admin</span>}
                </span>
                <button type="button" className="boton boton--secundario boton--pequeno" onClick={manejarSalir}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <a className="boton boton--secundario boton--pequeno" href={enlaceInterno('/login')} onClick={() => setMenuAbierto(false)}>
                  Iniciar sesión
                </a>
                <a className="boton boton--primario boton--pequeno" href={enlaceInterno('/registro')} onClick={() => setMenuAbierto(false)}>
                  Registrarse
                </a>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
