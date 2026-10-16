// ============================================================
// AuthContext.jsx
// Guarda quién tiene la sesión iniciada y expone login, registro y logout.
// ============================================================

import { createContext, useContext, useState } from 'react';
import { cerrarSesion, iniciarSesion, obtenerSesion, registrarUsuario } from '../services/usuariosService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Al arrancar se recupera la sesión guardada (si existe).
  const [usuario, setUsuario] = useState(() => obtenerSesion());

  // Inicia sesión; si sale bien, guarda el usuario en el estado.
  async function entrar(datos) {
    const resultado = await iniciarSesion(datos);
    if (resultado.ok) setUsuario(resultado.usuario);
    return resultado;
  }

  // Registra una cuenta nueva y deja la sesión abierta.
  async function registrar(datos) {
    const resultado = await registrarUsuario(datos);
    if (resultado.ok) setUsuario(resultado.usuario);
    return resultado;
  }

  // Cierra la sesión.
  function salir() {
    cerrarSesion();
    setUsuario(null);
  }

  const esAdmin = usuario !== null && usuario.rol === 'admin';

  return <AuthContext.Provider value={{ usuario, esAdmin, entrar, registrar, salir }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
