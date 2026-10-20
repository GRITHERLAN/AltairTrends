// ============================================================
// configService.js
// Lee y guarda la información de contacto, la descripción de marca
// y los indicadores. Solo el Administrador la edita desde su panel.
// ============================================================

import { CLAVES, leer, escribir } from './almacenamiento';
import { CONFIG_SEMILLA } from '../data/configSemilla';

// Devuelve la configuración guardada o, si no hay, la de por defecto.
export function obtenerConfig() {
  const guardada = leer(CLAVES.config, null);
  if (guardada) return guardada;
  escribir(CLAVES.config, CONFIG_SEMILLA);
  return CONFIG_SEMILLA;
}

// Valida y guarda la configuración editada.
export function guardarConfig(config) {
  const errores = {};
  const correo = String(config.correo ?? '').trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.correo = 'Ingresa un correo electrónico válido.';
  if (String(config.telefono ?? '').trim().length < 7) errores.telefono = 'Ingresa un teléfono válido.';
  if (String(config.descripcion ?? '').trim() === '') errores.descripcion = 'La descripción de marca es obligatoria.';

  // La cantidad de indicadores es libre (de 0 a N). Las filas totalmente vacías se descartan.
  const indicadores = (config.indicadores ?? []).filter((i) => [i.valor, i.etiqueta, i.detalle].some((texto) => String(texto ?? '').trim() !== ''));

  // Las filas que sí tienen algo escrito necesitan al menos valor y nombre.
  const indicadorIncompleto = indicadores.some((i) => String(i.valor ?? '').trim() === '' || String(i.etiqueta ?? '').trim() === '');
  if (indicadorIncompleto) errores.indicadores = 'Cada indicador necesita un valor y un nombre. Complétalo o quítalo.';

  if (Object.keys(errores).length > 0) return { ok: false, errores };

  // Se guarda la lista ya limpia, sin las filas vacías.
  const configLimpia = { ...config, indicadores };
  const resultado = escribir(CLAVES.config, configLimpia);
  if (!resultado.ok) return { ok: false, errores: { general: resultado.error } };
  return { ok: true, config: configLimpia };
}

// Guarda un mensaje enviado desde el formulario de contacto.
export function guardarMensajeContacto(mensaje) {
  const mensajes = leer(CLAVES.mensajes, []);
  mensajes.unshift({ ...mensaje, fecha: new Date().toISOString() });
  return escribir(CLAVES.mensajes, mensajes);
}
