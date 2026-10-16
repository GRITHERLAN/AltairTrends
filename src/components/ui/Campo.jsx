// ============================================================
// Campo.jsx
// Campo de formulario reutilizable: etiqueta + control + ayuda + error.
// "tipo" puede ser un input normal, 'textarea' o 'select' (con "opciones").
// ============================================================

export default function Campo({ id, etiqueta, tipo = 'text', valor, onCambio, error, ayuda, opciones, ...resto }) {
  let control;

  if (tipo === 'textarea') {
    control = <textarea id={id} className="campo__control" value={valor} onChange={onCambio} rows={4} {...resto} />;
  } else if (tipo === 'select') {
    control = (
      <select id={id} className="campo__control" value={valor} onChange={onCambio} {...resto}>
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
    );
  } else {
    control = <input id={id} type={tipo} className="campo__control" value={valor} onChange={onCambio} {...resto} />;
  }

  return (
    <div className={`campo ${error ? 'campo--error' : ''}`}>
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      {control}
      {ayuda && !error && <p className="campo__ayuda">{ayuda}</p>}
      {error && (
        <p className="campo__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
