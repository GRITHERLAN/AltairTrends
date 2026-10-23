// ============================================================
// erroresSupabase.js
// Convierte los errores técnicos de Supabase/PostgreSQL en mensajes
// en español que la interfaz puede mostrar tal cual.
// Códigos más usados de PostgreSQL:
//   23505 -> valor repetido (restricción UNIQUE)
//   23514 -> dato que no cumple una regla (restricción CHECK)
//   42501 -> sin permisos (políticas RLS)
// ============================================================

// Mensaje genérico cuando no hay conexión con el servidor.
const SIN_CONEXION = 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';

// Devuelve un mensaje en español para cualquier error de Supabase.
export function mensajeDeError(error) {
  if (!error) return '';

  // Fallo de red (sin internet, servidor caído...).
  if (error instanceof TypeError || String(error.message ?? '').includes('Failed to fetch')) {
    return SIN_CONEXION;
  }

  switch (error.code) {
    case '23505':
      return 'Ya existe un registro con ese valor.';
    case '23514':
    case '22P02':
      return 'Alguno de los datos no es válido. Revisa el formulario.';
    case '42501':
      return 'No tienes permisos para realizar esta acción. Inicia sesión como administrador.';
    case 'PGRST116':
      return 'El registro que buscas ya no existe.';
    default:
      return 'Ocurrió un error inesperado en el servidor. Inténtalo de nuevo.';
  }
}

// Indica si el error es un valor repetido y, si se indica, en qué restricción
// (por ejemplo "productos_nombre_unico"), para marcar el campo correcto.
export function esValorRepetido(error, restriccion = '') {
  if (!error || error.code !== '23505') return false;
  if (restriccion === '') return true;
  return String(error.message ?? '').includes(restriccion) || String(error.details ?? '').includes(restriccion);
}
