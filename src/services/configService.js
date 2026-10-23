// ============================================================
// configService.js
// Lee y guarda la información de contacto, la descripción de marca
// y los indicadores (tabla "contacto" de Supabase, una sola fila con id = 1).
// Cualquiera puede leerla; solo el Administrador la edita (RLS).
// También envía los mensajes del formulario de Contacto (función
// enviar_mensaje(), que los guarda cifrados en el servidor).
// ============================================================

import { CONFIG_SEMILLA } from '../data/configSemilla';
import { VERSION_POLITICA } from '../data/legal';
import { mensajeDeError } from './erroresSupabase';
import { supabase } from './supabaseCliente';

// Expresión para validar correos (la misma que usa la base de datos).
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Longitud máxima de cada texto de un indicador (las mismas que valida la base de datos).
export const LIMITES_INDICADOR = { valor: 40, etiqueta: 80, detalle: 300 };

// Límites del formulario de Contacto (los mismos que valida enviar_mensaje()).
export const LIMITES_MENSAJE = { nombre: 80, correo: 120, mensajeMinimo: 10, mensaje: 2000 };

// Devuelve la configuración guardada. Si la tabla aún está vacía, la de por defecto.
export async function obtenerConfig() {
  const { data, error } = await supabase.from('contacto').select('correo, telefono, descripcion, indicadores').eq('id', 1).maybeSingle();
  if (error) return { ok: false, config: CONFIG_SEMILLA, error: mensajeDeError(error) };
  return { ok: true, config: data ?? CONFIG_SEMILLA };
}

// Valida la configuración. Devuelve { errores, configLimpia }.
export function validarConfig(config) {
  const errores = {};
  const correo = String(config.correo ?? '').trim();
  const telefono = String(config.telefono ?? '').trim();
  const descripcion = String(config.descripcion ?? '').trim();

  if (!PATRON_CORREO.test(correo) || correo.length > 120) errores.correo = 'Ingresa un correo electrónico válido.';
  if (telefono.length < 7 || telefono.length > 30) errores.telefono = 'Ingresa un teléfono válido (entre 7 y 30 caracteres).';
  if (descripcion === '') errores.descripcion = 'La descripción de marca es obligatoria.';
  else if (descripcion.length > 3000) errores.descripcion = 'La descripción puede tener como máximo 3000 caracteres.';

  // La cantidad de indicadores es libre (de 0 a 20). Las filas totalmente vacías se descartan.
  const indicadores = (config.indicadores ?? [])
    .filter((i) => [i.valor, i.etiqueta, i.detalle].some((texto) => String(texto ?? '').trim() !== ''))
    .map((i) => ({ valor: String(i.valor ?? '').trim(), etiqueta: String(i.etiqueta ?? '').trim(), detalle: String(i.detalle ?? '').trim() }));

  // Las filas que sí tienen algo escrito necesitan al menos valor y nombre.
  const indicadorIncompleto = indicadores.some((i) => i.valor === '' || i.etiqueta === '');
  // Ningún texto puede pasar de su longitud máxima.
  const indicadorLargo = indicadores.some(
    (i) => i.valor.length > LIMITES_INDICADOR.valor || i.etiqueta.length > LIMITES_INDICADOR.etiqueta || i.detalle.length > LIMITES_INDICADOR.detalle
  );
  if (indicadorIncompleto) errores.indicadores = 'Cada indicador necesita un valor y un nombre. Complétalo o quítalo.';
  else if (indicadorLargo) errores.indicadores = `Revisa los indicadores: valor (máx. ${LIMITES_INDICADOR.valor}), nombre (máx. ${LIMITES_INDICADOR.etiqueta}) y detalle (máx. ${LIMITES_INDICADOR.detalle} caracteres).`;
  else if (indicadores.length > 20) errores.indicadores = 'Puedes tener como máximo 20 indicadores.';

  return { errores, configLimpia: { correo, telefono, descripcion, indicadores } };
}

// Valida y guarda la configuración editada (solo Administrador).
export async function guardarConfig(config) {
  const { errores, configLimpia } = validarConfig(config);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  // "upsert": crea la fila 1 si no existe o la actualiza si ya existe.
  // La fecha de actualización no se envía: la pone el servidor.
  const { data, error } = await supabase
    .from('contacto')
    .upsert({ id: 1, ...configLimpia })
    .select('correo, telefono, descripcion, indicadores')
    .single();

  if (error) return { ok: false, errores: { general: mensajeDeError(error) } };
  return { ok: true, config: data };
}

// Valida el formulario de Contacto. Devuelve un objeto con un error por campo (vacío si todo está bien).
export function validarMensajeContacto(mensaje) {
  const errores = {};
  const nombre = String(mensaje.nombre ?? '').trim();
  const correo = String(mensaje.correo ?? '').trim();
  const texto = String(mensaje.mensaje ?? '').trim();

  if (nombre === '') errores.nombre = 'Escribe tu nombre.';
  else if (nombre.length > LIMITES_MENSAJE.nombre) errores.nombre = `El nombre puede tener como máximo ${LIMITES_MENSAJE.nombre} caracteres.`;
  if (!PATRON_CORREO.test(correo) || correo.length > LIMITES_MENSAJE.correo) errores.correo = 'Ingresa un correo válido.';
  if (texto.length < LIMITES_MENSAJE.mensajeMinimo) errores.mensaje = `El mensaje debe tener al menos ${LIMITES_MENSAJE.mensajeMinimo} caracteres.`;
  else if (texto.length > LIMITES_MENSAJE.mensaje) errores.mensaje = `El mensaje puede tener como máximo ${LIMITES_MENSAJE.mensaje} caracteres.`;
  // Ley 1581 de 2012: la autorización debe ser previa y expresa (la casilla empieza sin marcar).
  if (mensaje.aceptaPolitica !== true) errores.aceptaPolitica = 'Debes autorizar el tratamiento de tus datos personales para enviar el mensaje.';

  return errores;
}

// Envía un mensaje del formulario de Contacto a la función enviar_mensaje() del servidor,
// que vuelve a validarlo, aplica los límites anti-bots y lo guarda CIFRADO.
// "trampa" es el campo oculto (honeypot): las personas lo dejan vacío.
export async function guardarMensajeContacto(mensaje) {
  const errores = validarMensajeContacto(mensaje);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const { data, error } = await supabase.rpc('enviar_mensaje', {
    p_nombre: mensaje.nombre.trim(),
    p_correo: mensaje.correo.trim(),
    p_mensaje: mensaje.mensaje.trim(),
    p_acepta_politica: mensaje.aceptaPolitica === true,
    p_version_politica: VERSION_POLITICA,
    p_trampa: mensaje.trampa ?? '',
  });
  if (error) return { ok: false, errores: { general: mensajeDeError(error) } };
  return data.ok ? { ok: true } : { ok: false, errores: { general: data.error } };
}
