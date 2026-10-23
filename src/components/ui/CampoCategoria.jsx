// ============================================================
// CampoCategoria.jsx
// Campo de categoría tipo "combobox": se puede escribir una categoría nueva
// o elegir una existente. A diferencia del <datalist> nativo, la lista
// SIEMPRE muestra todas las categorías (aunque el campo ya tenga texto).
// ============================================================

import { useEffect, useRef, useState } from 'react';

export default function CampoCategoria({ id, etiqueta, valor, onCambio, error, categorias }) {
  // Si la lista está desplegada o no.
  const [abierto, setAbierto] = useState(false);
  // Posición de la opción resaltada con el teclado (-1 = ninguna).
  const [indiceActivo, setIndiceActivo] = useState(-1);
  // Referencia al contenedor para detectar clics fuera del campo.
  const contenedorRef = useRef(null);

  const idLista = `${id}-lista`;

  // Cierra la lista al hacer clic fuera del campo.
  useEffect(() => {
    function cerrarAlHacerClicFuera(evento) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target)) {
        setAbierto(false);
      }
    }
    document.addEventListener('mousedown', cerrarAlHacerClicFuera);
    return () => document.removeEventListener('mousedown', cerrarAlHacerClicFuera);
  }, []);

  // Elige una categoría de la lista y cierra el desplegable.
  function elegir(categoria) {
    onCambio({ target: { value: categoria } });
    setAbierto(false);
    setIndiceActivo(-1);
  }

  // Navegación con teclado: flechas, Enter y Escape.
  function manejarTecla(evento) {
    if (evento.key === 'ArrowDown') {
      evento.preventDefault();
      setAbierto(true);
      setIndiceActivo((actual) => Math.min(actual + 1, categorias.length - 1));
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault();
      setIndiceActivo((actual) => Math.max(actual - 1, 0));
    } else if (evento.key === 'Enter' && abierto && indiceActivo >= 0) {
      // Solo se intercepta Enter si hay una opción resaltada (si no, se envía el formulario).
      evento.preventDefault();
      elegir(categorias[indiceActivo]);
    } else if (evento.key === 'Escape' && abierto) {
      // Escape cierra solo la lista, no el modal.
      evento.preventDefault();
      evento.stopPropagation();
      setAbierto(false);
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
          onChange={onCambio}
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
            setAbierto(!abierto);
          }}
        >
          ▾
        </button>

        {abierto && categorias.length > 0 && (
          <ul id={idLista} className="combo__lista" role="listbox">
            {categorias.map((categoria, indice) => (
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
