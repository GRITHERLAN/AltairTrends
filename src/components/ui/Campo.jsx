// ============================================================
// Campo.jsx
// Campo de formulario reutilizable: etiqueta + control + ayuda + error.
// "tipo" puede ser un input normal, 'textarea' o 'select' (con "opciones").
// Accesibilidad: el control queda enlazado con su ayuda o su error
// (aria-describedby) y se marca como inválido (aria-invalid) si hay error.
// ============================================================

export default function Campo({ id, etiqueta, tipo = 'text', valor, onCambio, error, ayuda, opciones, ...resto }) {
  // Identificador del texto que describe el campo: el error tiene prioridad sobre la ayuda.
  const idDescripcion = error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined;
  const accesibilidad = { 'aria-invalid': error ? true : undefined, 'aria-describedby': idDescripcion };

  let control;

  if (tipo === 'textarea') {
    control = <textarea id={id} className="campo__control" value={valor} onChange={onCambio} rows={4} {...accesibilidad} {...resto} />;
  } else if (tipo === 'select') {
    control = (
      <select id={id} className="campo__control" value={valor} onChange={onCambio} {...accesibilidad} {...resto}>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
    );
  } else {
    control = <input id={id} type={tipo} className="campo__control" value={valor} onChange={onCambio} {...accesibilidad} {...resto} />;
  }

  return (
    <div className={`campo ${error ? 'campo--error' : ''}`}>
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      {control}
      {ayuda && !error && (
        <p id={`${id}-ayuda`} className="campo__ayuda">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="campo__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
