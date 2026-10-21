// ============================================================
// usuariosService.js
// Login y sesión usando LocalStorage.
// IMPORTANTE: LocalStorage no es un lugar seguro. Aquí las contraseñas
// se guardan con hash (SHA-256) solo como buena práctica de ejemplo.
// ============================================================

import { CLAVES, leer, escribir, borrar } from './almacenamiento';

// Credenciales del administrador de prueba (se muestran en la pantalla de login).
export const ADMIN_SEMILLA = {
  correo: 'admin@altairtrends.co',
  contrasena: 'Admin123!',
};

// Convierte una contraseña en un hash SHA-256 (texto hexadecimal).
// Si el navegador no ofrece SubtleCrypto, se usa un respaldo simple.
async function hashContrasena(contrasena) {
  if (window.crypto && window.crypto.subtle) {
    const datos = new TextEncoder().encode(contrasena);
    const hash = await window.crypto.subtle.digest('SHA-256', datos);
    return Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
  return window.btoa(unescape(encodeURIComponent(contrasena)));
}

// Devuelve la lista de usuarios y se asegura de que el administrador de prueba exista.
async function obtenerUsuarios() {
  const usuarios = leer(CLAVES.usuarios, []);
  const hayAdmin = usuarios.some((u) => u.correo === ADMIN_SEMILLA.correo);

  if (!hayAdmin) {
    usuarios.push({
      nombre: 'Administrador',
      correo: ADMIN_SEMILLA.correo,
      hash: await hashContrasena(ADMIN_SEMILLA.contrasena),
      rol: 'admin',
    });
    escribir(CLAVES.usuarios, usuarios);
  }
  return usuarios;
}

// Quita datos sensibles (el hash) antes de entregar el usuario a la interfaz.
function usuarioPublico(usuario) {
  return { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
}

// Inicia sesión comparando correo y hash de la contraseña.
export async function iniciarSesion({ correo, contrasena }) {
  const usuarios = await obtenerUsuarios();
  const correoLimpio = correo.trim().toLowerCase();
  const hash = await hashContrasena(contrasena);
  const encontrado = usuarios.find((u) => u.correo === correoLimpio && u.hash === hash);

  if (!encontrado) return { ok: false, error: 'Correo o contraseña incorrectos.' };

  escribir(CLAVES.sesion, usuarioPublico(encontrado));
  return { ok: true, usuario: usuarioPublico(encontrado) };
}

// Devuelve el usuario con sesión activa (o null).
export function obtenerSesion() {
  return leer(CLAVES.sesion, null);
}

// Cierra la sesión.
export function cerrarSesion() {
  borrar(CLAVES.sesion);
}
