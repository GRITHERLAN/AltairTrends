// ============================================================
// AuthContext.jsx
// Guarda quién tiene la sesión iniciada (Supabase Auth) y expone login y logout.
// Mientras se recupera la sesión guardada, "cargando" es true.
// ============================================================

import { createContext, useContext, useEffect, useState } from 'react';
import { cerrarSesion, escucharCierreSesion, iniciarSesion, obtenerSesion } from '../services/usuariosService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // "activo" evita actualizar el estado si el componente ya se desmontó.
    let activo = true;

    // 1) Al arrancar se recupera la sesión guardada (si existe).
    obtenerSesion().then((guardado) => {
      if (!activo) return;
      setUsuario(guardado);
      setCargando(false);
    });

    // 2) Si la sesión se cierra por otro motivo (caducó, otra pestaña...), se refleja aquí.
    const dejarDeEscuchar = escucharCierreSesion(() => setUsuario(null));

    return () => {
      activo = false;
      dejarDeEscuchar();
    };
  }, []);

  // Inicia sesión; si sale bien, guarda el usuario en el estado.
  async function entrar(datos) {
    const resultado = await iniciarSesion(datos);
    if (resultado.ok) setUsuario(resultado.usuario);
    return resultado;
  }

  // Cierra la sesión.
  async function salir() {
    await cerrarSesion();
    setUsuario(null);
  }

  const esAdmin = usuario !== null && usuario.rol === 'admin';

  return <AuthContext.Provider value={{ usuario, esAdmin, cargando, entrar, salir }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
