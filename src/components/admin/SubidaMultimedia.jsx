// ============================================================
// SubidaMultimedia.jsx
// Permite agregar imágenes y videos a un producto:
//   - por URL (imágenes o videos), o
//   - subiendo una imagen desde el equipo (se reduce de tamaño y se
//     guarda como texto base64 para que quepa en LocalStorage).
// Los videos pesan demasiado para LocalStorage, por eso solo van por URL.
// ============================================================

import { useState } from 'react';
import { esUrlValida } from '../../services/productosService';
import MediaProducto from '../catalogo/MediaProducto';

// Ancho/alto máximo (en píxeles) al que se reducen las imágenes subidas.
const LADO_MAXIMO = 800;

// Extensiones que se reconocen como video cuando se pega una URL.
const EXTENSIONES_VIDEO = ['.mp4', '.webm', '.ogg', '.mov'];

// Lee un archivo de imagen, lo reduce con un canvas y devuelve un texto "data URL" (JPEG).
function comprimirImagen(archivo) {
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
      resolver(lienzo.toDataURL('image/jpeg', 0.75));
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
    const esVideo = EXTENSIONES_VIDEO.some((extension) => limpia.toLowerCase().split('?')[0].endsWith(extension));
    onCambiar([...multimedia, { tipo: esVideo ? 'video' : 'imagen', url: limpia }]);
    setUrl('');
    setMensaje('');
  }

  // Procesa los archivos elegidos desde el equipo.
  async function agregarArchivos(evento) {
    const archivos = Array.from(evento.target.files);
    evento.target.value = ''; // Permite volver a elegir el mismo archivo.
    let nuevos = [...multimedia];
    let aviso = '';

    for (const archivo of archivos) {
      if (!archivo.type.startsWith('image/')) {
        aviso = 'Solo se pueden subir imágenes desde el equipo. Los videos se agregan con una URL.';
        continue;
      }
      try {
        const datos = await comprimirImagen(archivo);
        nuevos = [...nuevos, { tipo: 'imagen', url: datos }];
      } catch (error) {
        aviso = 'No se pudo procesar una de las imágenes.';
      }
    }
    onCambiar(nuevos);
    setMensaje(aviso);
  }

  // Quita un elemento de la lista por su posición.
  function quitar(posicion) {
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
          O subir imágenes desde tu equipo
        </label>
        <input id="multimedia-archivo" type="file" accept="image/*" multiple className="campo__control" onChange={agregarArchivos} />
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
