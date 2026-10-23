// ============================================================
// usuariosService.js
// Login y sesión con Supabase Auth.
// Las contraseñas las guarda y comprueba Supabase (con hash bcrypt) en
// el servidor: el navegador nunca compara contraseñas.
// El rol (admin | usuario) está en la tabla "usuarios" y solo se cambia
// desde el panel de Supabase.
// ============================================================

import { mensajeDeError } from './erroresSupabase';
import { supabase } from './supabaseCliente';

// Busca el perfil (nombre y rol) de una cuenta de Supabase Auth.
// Devuelve el usuario listo para la interfaz, o null si no tiene perfil.
async function obtenerPerfil(cuenta) {
  const { data, error } = await supabase.from('usuarios').select('nombre, rol').eq('id', cuenta.id).maybeSingle();
  if (error || !data) return null;
  return { id: cuenta.id, nombre: data.nombre || 'Usuario', correo: cuenta.email, rol: data.rol };
}

// Inicia sesión con correo y contraseña.
export async function iniciarSesion({ correo, contrasena }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: correo.trim().toLowerCase(),
    password: contrasena,
  });

  if (error) {
    if (error.code === 'invalid_credentials' || error.status === 400) return { ok: false, error: 'Correo o contraseña incorrectos.' };
    if (error.status === 429) return { ok: false, error: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.' };
    return { ok: false, error: mensajeDeError(error) };
  }

  const usuario = await obtenerPerfil(data.user);
  if (!usuario) {
    // Cuenta sin perfil: no se deja la sesión abierta a medias.
    await supabase.auth.signOut();
    return { ok: false, error: 'Tu cuenta no tiene un perfil asignado. Contacta al administrador.' };
  }
  return { ok: true, usuario };
}

// Devuelve el usuario con sesión activa (o null). La sesión la guarda Supabase en el navegador.
export async function obtenerSesion() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  return obtenerPerfil(data.session.user);
}

// Cierra la sesión.
export async function cerrarSesion() {
  await supabase.auth.signOut();
}

// Avisa cuando la sesión se cierra por otro motivo (caducó, se cerró en otra pestaña...).
// Devuelve una función para dejar de escuchar.
export function escucharCierreSesion(alCerrar) {
  const { data } = supabase.auth.onAuthStateChange((evento) => {
    if (evento === 'SIGNED_OUT') alCerrar();
  });
  return () => data.subscription.unsubscribe();
}
