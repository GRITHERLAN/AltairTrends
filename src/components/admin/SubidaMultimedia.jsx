// ============================================================
// SubidaMultimedia.jsx
// Permite agregar imágenes y videos a un producto:
//   - por URL (imágenes o videos), o
//   - eligiendo archivos desde el equipo. Las imágenes se reducen de tamaño
//     antes de subirlas; los videos (MP4/WEBM) se suben tal cual (máx. 20 MB).
//
// Los archivos del equipo NO se suben aquí: quedan "pendientes" con una
// vista previa local y se suben a Supabase Storage al guardar el producto
// (ver multimediaService). Así, si se cancela el formulario, no queda nada
// subido sin usar.
// ============================================================

import { useState } from 'react';
import { TAMANO_MAXIMO, formatoPermitido } from '../../services/multimediaService';
import { esUrlValida } from '../../services/productosService';
import MediaProducto from '../catalogo/MediaProducto';

// Ancho/alto máximo (en píxeles) al que se reducen las imágenes subidas.
const LADO_MAXIMO = 1200;

// Máximo de elementos por producto (igual que en la base de datos).
const MAXIMO_ELEMENTOS = 20;

// Extensiones que se reconocen como video cuando se pega una URL.
const EXTENSIONES_VIDEO = ['.mp4', '.webm', '.ogg', '.mov'];

// Lee un archivo de imagen, lo reduce con un canvas y devuelve un archivo JPEG (Blob).
// Los GIF se dejan tal cual para no perder la animación.
function comprimirImagen(archivo) {
  if (archivo.type === 'image/gif') return Promise.resolve(archivo);

  return new Promise((resolver, rechazar) => {
    const urlTemporal = URL.createObjectURL(archivo);
    const imagen = new Image();

    imagen.onload = () => {
      // Calcula el factor para que el lado más grande no supere LADO_MAXIMO.
      const factor = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height));
      const lienzo = document.createElement('canvas');
      lienzo.width = Math.round(imagen.width * factor);
      lienzo.height = Math.round(imagen.height * factor);
      lienzo.getContext('2d').drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
      URL.revokeObjectURL(urlTemporal);
      lienzo.toBlob((blob) => (blob ? resolver(blob) : rechazar(new Error('No se pudo comprimir la imagen.'))), 'image/jpeg', 0.82);
    };
    imagen.onerror = () => {
      URL.revokeObjectURL(urlTemporal);
      rechazar(new Error('No se pudo leer la imagen.'));
    };
    imagen.src = urlTemporal;
  });
}

export default function SubidaMultimedia({ multimedia, onCambiar }) {
  const [url, setUrl] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Agrega un enlace (imagen o video según su extensión).
  function agregarUrl(evento) {
    evento.preventDefault();
    const limpia = url.trim();

    if (!esUrlValida(limpia)) {
      setMensaje('Ingresa una URL válida que empiece por http:// o https://.');
      return;
    }
    if (multimedia.length >= MAXIMO_ELEMENTOS) {
      setMensaje(`Un producto puede tener como máximo ${MAXIMO_ELEMENTOS} imágenes o videos.`);
      return;
    }
    const esVideo = EXTENSIONES_VIDEO.some((extension) => limpia.toLowerCase().split('?')[0].endsWith(extension));
    onCambiar([...multimedia, { tipo: esVideo ? 'video' : 'imagen', url: limpia }]);
    setUrl('');
    setMensaje('');
  }

  // Procesa los archivos elegidos desde el equipo y los deja pendientes de subir.
  async function agregarArchivos(evento) {
    const archivos = Array.from(evento.target.files);
    evento.target.value = ''; // Permite volver a elegir el mismo archivo.
    let nuevos = [...multimedia];
    let aviso = '';

    for (const archivo of archivos) {
      if (nuevos.length >= MAXIMO_ELEMENTOS) {
        aviso = `Un producto puede tener como máximo ${MAXIMO_ELEMENTOS} imágenes o videos.`;
        break;
      }
      if (!formatoPermitido(archivo.type)) {
        aviso = 'Formato no permitido. Usa imágenes JPG, PNG, WEBP o GIF, o videos MP4 o WEBM.';
        continue;
      }

      const esVideo = archivo.type.startsWith('video/');
      try {
        // Las imágenes se comprimen; los videos se usan tal cual.
        const listo = esVideo ? archivo : await comprimirImagen(archivo);
        if (listo.size > TAMANO_MAXIMO) {
          aviso = 'Cada archivo puede pesar como máximo 20 MB.';
          continue;
        }
        // "url" es una vista previa local; "archivo" es lo que se subirá al guardar.
        nuevos = [...nuevos, { tipo: esVideo ? 'video' : 'imagen', url: URL.createObjectURL(listo), archivo: listo }];
      } catch (error) {
        aviso = 'No se pudo procesar una de las imágenes.';
      }
    }
    onCambiar(nuevos);
    setMensaje(aviso);
  }

  // Quita un elemento de la lista por su posición (y libera su vista previa local).
  function quitar(posicion) {
    const medio = multimedia[posicion];
    if (medio.archivo) URL.revokeObjectURL(medio.url);
    onCambiar(multimedia.filter((_, i) => i !== posicion));
  }

  return (
    <fieldset className="multimedia">
      <legend className="campo__etiqueta">Imágenes y videos</legend>

      <div className="multimedia__entrada">
        <label className="campo__etiqueta" htmlFor="multimedia-url">
          Agregar por URL
        </label>
        <div className="multimedia__url">
          <input
            id="multimedia-url"
            type="url"
            className="campo__control"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="button" className="boton boton--secundario" onClick={agregarUrl}>
            Agregar
          </button>
        </div>
      </div>

      <div className="multimedia__entrada">
        <label className="campo__etiqueta" htmlFor="multimedia-archivo">
          O subir imágenes y videos desde tu equipo (máx. 20 MB cada uno)
        </label>
        <input
          id="multimedia-archivo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          multiple
          className="campo__control"
          onChange={agregarArchivos}
        />
      </div>

      {mensaje && (
        <p className="campo__error" role="alert">
          {mensaje}
        </p>
      )}

      {multimedia.length > 0 && (
        <ul className="multimedia__lista">
          {multimedia.map((medio, posicion) => (
            <li key={posicion} className="multimedia__item">
              <div className="multimedia__vista">
                <MediaProducto medio={medio} nombre={`Elemento ${posicion + 1}`} />
              </div>
              {medio.archivo && <span className="campo__ayuda">Se subirá al guardar</span>}
              <button type="button" className="boton boton--peligro boton--pequeno" onClick={() => quitar(posicion)}>
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
}
