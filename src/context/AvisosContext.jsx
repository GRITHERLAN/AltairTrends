// ============================================================
// AvisosContext.jsx
// Sistema de avisos visuales (toasts) con el estilo de la web.
// Reemplaza a alert(): cualquier componente puede llamar
// mostrarAviso('exito' | 'error' | 'info', 'Texto').
// ============================================================

import { createContext, useCallback, useContext, useState } from 'react';

const AvisosContext = createContext(null);

// Milisegundos que tarda un aviso en desaparecer solo.
const DURACION_AVISO = 4500;

// Contador para dar un identificador único a cada aviso.
let contadorAvisos = 0;

export function AvisosProvider({ children }) {
  const [avisos, setAvisos] = useState([]);

  // Quita un aviso de la lista.
  const cerrarAviso = useCallback((id) => {
    setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id));
  }, []);

  // Agrega un aviso y programa su desaparición automática.
  const mostrarAviso = useCallback(
    (tipo, texto) => {
      contadorAvisos += 1;
      const id = contadorAvisos;
      setAvisos((actuales) => [...actuales, { id, tipo, texto }]);
      window.setTimeout(() => cerrarAviso(id), DURACION_AVISO);
    },
    [cerrarAviso]
  );

  return <AvisosContext.Provider value={{ avisos, mostrarAviso, cerrarAviso }}>{children}</AvisosContext.Provider>;
}

// Hook para usar los avisos desde cualquier componente.
export function useAvisos() {
  return useContext(AvisosContext);
}
