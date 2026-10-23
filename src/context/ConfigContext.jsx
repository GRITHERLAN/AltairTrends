// ============================================================
// ConfigContext.jsx
// Información de contacto, descripción de marca e indicadores (desde Supabase).
// Mientras se descarga, "cargando" es true; si falla, "error" trae el mensaje.
// ============================================================

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CONFIG_SEMILLA } from '../data/configSemilla';
import { guardarConfig, obtenerConfig } from '../services/configService';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  // Se arranca con la configuración por defecto para que la web nunca quede sin datos.
  const [config, setConfig] = useState(CONFIG_SEMILLA);
  const [cargando, setCargando] = useState(true);
  // "listo" pasa a true tras la PRIMERA descarga.
  const [listo, setListo] = useState(false);
  const [error, setError] = useState('');

  // Descarga la configuración desde Supabase.
  const recargar = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerConfig();
    setConfig(resultado.config);
    setError(resultado.ok ? '' : resultado.error);
    setCargando(false);
    setListo(true);
  }, []);

  useEffect(() => {
    recargar();
  }, [recargar]);

  // Guarda cambios (solo se llama desde el panel del administrador).
  async function actualizarConfig(nueva) {
    const resultado = await guardarConfig(nueva);
    if (resultado.ok) setConfig(resultado.config);
    return resultado;
  }

  return <ConfigContext.Provider value={{ config, cargando, listo, error, recargar, actualizarConfig }}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  return useContext(ConfigContext);
}
