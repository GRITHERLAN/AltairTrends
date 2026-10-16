// ============================================================
// ConfigContext.jsx
// Información de contacto, descripción de marca e indicadores.
// ============================================================

import { createContext, useContext, useState } from 'react';
import { guardarConfig, obtenerConfig } from '../services/configService';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(() => obtenerConfig());

  // Guarda cambios (solo se llama desde el panel del administrador).
  function actualizarConfig(nueva) {
    const resultado = guardarConfig(nueva);
    if (resultado.ok) setConfig(resultado.config);
    return resultado;
  }

  return <ConfigContext.Provider value={{ config, actualizarConfig }}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return useContext(ConfigContext);
}
