// ============================================================
// FormularioProducto.jsx
// Ventana modal para crear o editar un producto.
// Validación en dos niveles:
//   1) FrontEnd: se valida aquí con validarProducto (ID y nombre únicos, etc.).
//   2) BackEnd: productosService vuelve a validar y la base de datos aplica
//      sus restricciones (UNIQUE, CHECK, RLS); si devuelve errores, se
//      muestran en los mismos campos.
// La fecha de creación NO se pide: la genera la base de datos al guardar.
// ============================================================

import { useState } from 'react';
import { LIMITES, validarProducto } from '../../services/productosService';
import Campo from '../ui/Campo';
import CampoCategoria from '../ui/CampoCategoria';
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
  // true mientras se suben los archivos y se guarda en Supabase.
  const [guardando, setGuardando] = useState(false);

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

  async function manejarEnvio(evento) {
    evento.preventDefault();

    // 1) Validación de FrontEnd.
    const erroresFront = validarProducto(datos, productos, editando ? producto.id : null);
    if (Object.keys(erroresFront).length > 0) {
      setErrores(erroresFront);
      return;
    }

    // 2) Guardado: el servicio (BackEnd) valida otra vez y puede devolver errores.
    setGuardando(true);
    const resultado = await onGuardar(datos, editando ? producto.id : null);
    if (!resultado.ok) {
      setErrores(resultado.errores);
      setGuardando(false);
    }
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
          {/* maxLength: el navegador no deja escribir más de lo que acepta la base de datos */}
          <Campo id="producto-id" etiqueta="ID único" maxLength={LIMITES.id} valor={datos.id} error={errores.id} placeholder="Ej.: ALT-111" onCambio={(e) => cambiar('id', e.target.value)} />
          <Campo id="producto-nombre" etiqueta="Nombre" maxLength={LIMITES.nombre} valor={datos.nombre} error={errores.nombre} onCambio={(e) => cambiar('nombre', e.target.value)} />
          <Campo id="producto-precio" tipo="number" min="0" step="1" etiqueta="Precio (COP - Peso colombiano)" valor={datos.precio} error={errores.precio} onCambio={(e) => cambiar('precio', e.target.value)} />
          <Campo id="producto-stock" tipo="number" min="0" step="1" etiqueta="Stock (cantidad de unidades)" valor={datos.stock} error={errores.stock} onCambio={(e) => cambiar('stock', e.target.value)} />
        </div>

        {/* La categoría es un combobox: siempre despliega todas las existentes, o se puede escribir una nueva */}
        <CampoCategoria id="producto-categoria" etiqueta="Categoría" valor={datos.categoria} error={errores.categoria} categorias={categorias} onCambio={(e) => cambiar('categoria', e.target.value)} />

        <Campo id="producto-descripcion" tipo="textarea" etiqueta="Descripción" maxLength={LIMITES.descripcion} valor={datos.descripcion} error={errores.descripcion} onCambio={(e) => cambiar('descripcion', e.target.value)} />

        <Campo
          id="producto-enlace"
          tipo="url"
          etiqueta="Enlace del botón Comprar"
          maxLength={LIMITES.enlaceCompra}
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

        <p className="campo__ayuda">
          La fecha de creación se registra automáticamente al guardar, también cuando se edita. Las imágenes y videos elegidos desde tu equipo se suben al guardar.
        </p>

        <div className="modal__acciones">
          <button type="button" className="boton boton--secundario" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="boton boton--primario" disabled={guardando}>
            {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear producto'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
