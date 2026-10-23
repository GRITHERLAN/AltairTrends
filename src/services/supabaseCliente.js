// ============================================================
// supabaseCliente.js
// Crea UNA sola conexión con Supabase para toda la aplicación.
// Los servicios importan "supabase" desde aquí; los componentes
// nunca hablan con Supabase directamente.
//
// La URL y la clave pública se leen del archivo .env (ver .env.example).
// La clave "publishable" puede estar en el navegador: lo que protege
// los datos son las políticas RLS definidas en la base de datos.
// ============================================================

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const clavePublica = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Sin credenciales la app no puede funcionar: se avisa con un mensaje claro en la consola.
if (!url || !clavePublica) {
  throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_PUBLISHABLE_KEY en el archivo .env (copia .env.example).');
}

export const supabase = createClient(url, clavePublica, {
  auth: {
    persistSession: true, // Mantiene la sesión al recargar la página.
    autoRefreshToken: true, // Renueva el token antes de que caduque.
    detectSessionInUrl: false, // No usamos enlaces mágicos ni OAuth.
  },
});
