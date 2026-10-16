// ============================================================
// FormularioProducto.jsx
// Ventana modal para crear o editar un producto.
// Validación en dos niveles:
//   1) FrontEnd: se valida aquí con validarProducto (ID y nombre únicos, etc.).
//   2) BackEnd: productosService vuelve a validar al guardar; si devuelve
//      errores, se muestran en los mismos campos.
// La fecha de creación NO se pide: se genera automáticamente al guardar.
// ============================================================

import { useState } from 'react';
import { validarProducto } from '../../services/productosService';
import Campo from '../ui/Campo';
import Modal from '../ui/Modal';
import SubidaMultimedia from './SubidaMultimedia';

// Valores iniciales de un producto nuevo (Modo estándar: activo).
const PRODUCTO_NUEVO = {
  id: '',
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: '',
  stock: '',
  enlaceCompra: '',
  activo: true,
  multimedia: [],
};

export default function FormularioProducto({ producto, productos, categorias, onGuardar, onCerrar }) {
  const editando = producto !== null;
  const [datos, setDatos] = useState(editando ? { ...producto, precio: String(producto.precio), stock: String(producto.stock) } : PRODUCTO_NUEVO);
  const [errores, setErrores] = useState({});

  // Cambia un campo. Para ID y nombre se comprueba duplicado al momento de escribir.
  function cambiar(campo, valor) {
    const nuevos = { ...datos, [campo]: valor };
    setDatos(nuevos);

    if (campo === 'id' || campo === 'nombre') {
      const validacion = validarProducto(nuevos, productos, editando ? producto.id : null);
      setErrores({ ...errores, [campo]: validacion[campo], general: undefined });
    } else {
      setErrores({ ...errores, [campo]: undefined, general: undefined });
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    // 1) Validación de FrontEnd.
    const erroresFront = validarProducto(datos, productos, editando ? producto.id : null);
    if (Object.keys(erroresFront).length > 0) {
      setErrores(erroresFront);
      return;
    }

    // 2) Guardado: el servicio (BackEnd) valida otra vez y puede devolver errores.
    const resultado = onGuardar(datos, editando ? producto.id : null);
    if (!resultado.ok) setErrores(resultado.errores);
  }

  return (
    <Modal titulo={editando ? `Editar producto ${producto.id}` : 'Crear nuevo producto'} onCerrar={onCerrar} ancho="ancho">
      <form className="formulario" onSubmit={manejarEnvio} noValidate>
        {errores.general && (
          <p className="mensaje mensaje--error" role="alert">
            {errores.general}
          </p>
        )}

        <div className="formulario__rejilla">
          <Campo id="producto-id" etiqueta="ID único" valor={datos.id} error={errores.id} placeholder="Ej.: ALT-111" onCambio={(e) => cambiar('id', e.target.value)} />
          <Campo id="producto-nombre" etiqueta="Nombre" valor={datos.nombre} error={errores.nombre} onCambio={(e) => cambiar('nombre', e.target.value)} />
          <Campo id="producto-precio" tipo="number" min="0" step="1" etiqueta="Precio (COP - Peso colombiano)" valor={datos.precio} error={errores.precio} onCambio={(e) => cambiar('precio', e.target.value)} />
          <Campo id="producto-stock" tipo="number" min="0" step="1" etiqueta="Stock (cantidad de unidades)" valor={datos.stock} error={errores.stock} onCambio={(e) => cambiar('stock', e.target.value)} />
        </div>

        {/* La categoría es un campo de texto con sugerencias (datalist): se puede elegir una existente o escribir una nueva */}
        <Campo id="producto-categoria" etiqueta="Categoría" valor={datos.categoria} error={errores.categoria} list="lista-categorias" onCambio={(e) => cambiar('categoria', e.target.value)} />
        <datalist id="lista-categorias">
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria} />
          ))}
        </datalist>

        <Campo id="producto-descripcion" tipo="textarea" etiqueta="Descripción" valor={datos.descripcion} error={errores.descripcion} onCambio={(e) => cambiar('descripcion', e.target.value)} />

        <Campo
          id="producto-enlace"
          tipo="url"
          etiqueta="Enlace del botón Comprar"
          valor={datos.enlaceCompra}
          error={errores.enlaceCompra}
          placeholder="https://..."
          ayuda="Al pulsar Comprar, el usuario será redirigido a este enlace."
          onCambio={(e) => cambiar('enlaceCompra', e.target.value)}
        />

        <SubidaMultimedia multimedia={datos.multimedia} onCambiar={(lista) => setDatos({ ...datos, multimedia: lista })} />

        <label className="casilla">
          <input type="checkbox" checked={datos.activo} onChange={(e) => cambiar('activo', e.target.checked)} />
          <span>Producto activo (visible para los usuarios)</span>
        </label>

        <p className="campo__ayuda">La fecha de creación se registra automáticamente al guardar, también cuando se edita.</p>

        <div className="modal__acciones">
          <button type="button" className="boton boton--secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="boton boton--primario">
            {editando ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
