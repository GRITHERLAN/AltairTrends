// ============================================================
// CampoCategoria.jsx
// Campo de categoría tipo "combobox": se puede escribir una categoría nueva
// o elegir una existente. Al abrir el campo la lista muestra TODAS las
// categorías (aunque ya tenga texto); en cuanto el usuario escribe, la lista
// se filtra en vivo con las categorías que coinciden con lo escrito.
// ============================================================

import { useEffect, useRef, useState } from 'react';

// Quita tildes y pasa a minúsculas para comparar sin distinguir "Café" de "cafe".
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function CampoCategoria({ id, etiqueta, valor, onCambio, error, categorias }) {
  // Si la lista está desplegada o no.
  const [abierto, setAbierto] = useState(false);
  // Posición de la opción resaltada con el teclado (-1 = ninguna).
  const [indiceActivo, setIndiceActivo] = useState(-1);
  // true solo cuando el usuario está escribiendo: ahí se aplica el filtro.
  const [filtrando, setFiltrando] = useState(false);
  // Referencia al contenedor para detectar clics fuera del campo.
  const contenedorRef = useRef(null);

  const idLista = `${id}-lista`;

  // Categorías visibles: todas, o solo las que contienen el texto escrito.
  const textoBuscado = normalizar(valor);
  const visibles = filtrando
    ? categorias.filter((categoria) => normalizar(categoria).includes(textoBuscado))
    : categorias;

  // Cierra la lista al hacer clic fuera del campo.
  useEffect(() => {
    function cerrarAlHacerClicFuera(evento) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target)) {
        setAbierto(false);
        setFiltrando(false);
      }
    }
    document.addEventListener('mousedown', cerrarAlHacerClicFuera);
    return () => document.removeEventListener('mousedown', cerrarAlHacerClicFuera);
  }, []);

  // Elige una categoría de la lista y cierra el desplegable.
  function elegir(categoria) {
    onCambio({ target: { value: categoria } });
    setAbierto(false);
    setFiltrando(false);
    setIndiceActivo(-1);
  }

  // Al escribir: se filtra la lista en vivo y se quita la opción resaltada
  // (la lista cambió, el índice anterior ya no apunta a la misma categoría).
  function manejarEscritura(evento) {
    onCambio(evento);
    setFiltrando(true);
    setAbierto(true);
    setIndiceActivo(-1);
  }

  // Navegación con teclado: flechas, Enter y Escape (sobre la lista ya filtrada).
  function manejarTecla(evento) {
    if (evento.key === 'ArrowDown') {
      evento.preventDefault();
      setAbierto(true);
      setIndiceActivo((actual) => Math.min(actual + 1, visibles.length - 1));
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault();
      setIndiceActivo((actual) => Math.max(actual - 1, 0));
    } else if (evento.key === 'Enter' && abierto && indiceActivo >= 0 && visibles[indiceActivo]) {
      // Solo se intercepta Enter si hay una opción resaltada (si no, se envía el formulario).
      evento.preventDefault();
      elegir(visibles[indiceActivo]);
    } else if (evento.key === 'Escape' && abierto) {
      // Escape cierra solo la lista, no el modal.
      evento.preventDefault();
      evento.stopPropagation();
      setAbierto(false);
      setFiltrando(false);
    }
  }

  return (
    <div className={`campo ${error ? 'campo--error' : ''}`} ref={contenedorRef}>
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>

      <div className="combo">
        <input
          id={id}
          type="text"
          className="campo__control combo__entrada"
          value={valor}
          maxLength={60}
          autoComplete="off"
          role="combobox"
          aria-expanded={abierto}
          aria-controls={idLista}
          aria-autocomplete="list"
          onChange={manejarEscritura}
          onFocus={() => setAbierto(true)}
          onClick={() => setAbierto(true)}
          onKeyDown={manejarTecla}
        />
        {/* Flecha: abre o cierra la lista con el ratón/dedo. */}
        <button
          type="button"
          className="combo__flecha"
          aria-label={abierto ? 'Ocultar categorías' : 'Mostrar categorías'}
          tabIndex={-1}
          onClick={(evento) => {
            evento.preventDefault();
            // La flecha siempre muestra la lista completa.
            setFiltrando(false);
            setAbierto(!abierto);
          }}
        >
          ▾
        </button>

        {abierto && categorias.length > 0 && (
          <ul id={idLista} className="combo__lista" role="listbox">
            {/* Sin coincidencias: se avisa que al guardar se creará una categoría nueva. */}
            {visibles.length === 0 && (
              <li className="combo__vacio">Sin coincidencias: se creará una categoría nueva</li>
            )}
            {visibles.map((categoria, indice) => (
              <li
                key={categoria}
                role="option"
                aria-selected={categoria === valor}
                className={`combo__opcion ${categoria === valor ? 'combo__opcion--elegida' : ''} ${indice === indiceActivo ? 'combo__opcion--activa' : ''}`}
                // mousedown (y no click) para elegir antes de que el input pierda el foco.
                onMouseDown={(evento) => {
                  evento.preventDefault();
                  elegir(categoria);
                }}
              >
                {categoria}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p className="campo__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
