// ============================================================
// PaginaAdmin.jsx
// Panel de administración: resumen, alerta de productos antiguos, filtros,
// tabla con CRUD, y edición de contacto/indicadores.
// Solo accesible para el rol "admin".
// ============================================================

import { useState } from 'react';
import AlertaAntiguos from '../components/admin/AlertaAntiguos';
import EditorContacto from '../components/admin/EditorContacto';
import FiltrosAdmin from '../components/admin/FiltrosAdmin';
import FormularioCategoria from '../components/admin/FormularioCategoria';
import FormularioProducto from '../components/admin/FormularioProducto';
import GraficoCategorias from '../components/admin/GraficoCategorias';
import GraficoProductos from '../components/admin/GraficoProductos';
import ResumenKpis from '../components/admin/ResumenKpis';
import TablaProductos from '../components/admin/TablaProductos';
import ModalConfirmacion from '../components/ui/ModalConfirmacion';
import { useAuth } from '../context/AuthContext';
import { useAvisos } from '../context/AvisosContext';
import { useProductos } from '../context/ProductosContext';
import { requiereModificacion } from '../utils/formatos';
import { enlaceInterno } from '../utils/rutasCifradas';
import { FILTROS_INICIALES, filtrarProductos, obtenerCategorias } from '../utils/filtrarProductos';

export default function PaginaAdmin() {
  const { esAdmin } = useAuth();
  const { productos, ventas, ventasProducto, categoriasExtra, agregarCategoria, crear, actualizar, eliminar, cambiarEstado, restablecer } = useProductos();
  const { mostrarAviso } = useAvisos();

  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  // Qué modal está abierta: null | { tipo: 'formulario', producto } | { tipo: 'categoria' } | { tipo: 'borrar', producto } | { tipo: 'restablecer' }
  const [modal, setModal] = useState(null);

  // Protección de la ruta: quien no sea admin ve un aviso en la propia página.
  if (!esAdmin) {
    return (
      <section className="contenedor vacio">
        <h1 className="vacio__titulo">Acceso restringido</h1>
        <p>Esta sección es solo para administradores. Inicia sesión con una cuenta de administrador.</p>
        <a className="boton boton--primario" href={enlaceInterno('/login')}>
          Iniciar sesión
        </a>
      </section>
    );
  }

  // Categorías de los productos + las creadas a mano (aunque aún no tengan productos).
  const categorias = [...new Set([...obtenerCategorias(productos), ...categoriasExtra])].sort((a, b) => a.localeCompare(b, 'es'));
  const antiguos = productos.filter(requiereModificacion);
  const visibles = filtrarProductos(productos, filtros);
  const conteo = {
    todos: productos.length,
    activos: productos.filter((p) => p.activo).length,
    inactivos: productos.filter((p) => !p.activo).length,
  };

  // Guarda desde el formulario (crear o editar) y devuelve el resultado al formulario.
  function guardarProducto(datos, idOriginal) {
    const resultado = idOriginal === null ? crear(datos) : actualizar(idOriginal, datos);
    if (resultado.ok) {
      setModal(null);
      mostrarAviso('exito', idOriginal === null ? `Producto "${resultado.producto.nombre}" creado.` : `Producto "${resultado.producto.nombre}" actualizado.`);
    }
    return resultado;
  }

  // Guarda la categoría nueva desde su modal y devuelve el resultado al formulario.
  function guardarCategoria(nombre) {
    const resultado = agregarCategoria(nombre, categorias);
    if (resultado.ok) {
      setModal(null);
      mostrarAviso('exito', `Categoría "${resultado.categoria}" creada.`);
    }
    return resultado;
  }

  function alternarEstado(producto) {
    const resultado = cambiarEstado(producto.id);
    if (resultado.ok) {
      mostrarAviso('info', `"${producto.nombre}" ahora está ${producto.activo ? 'inactivo' : 'activo'}.`);
    } else {
      mostrarAviso('error', resultado.error);
    }
  }

  function confirmarBorrado() {
    const producto = modal.producto;
    const resultado = eliminar(producto.id);
    setModal(null);
    mostrarAviso(resultado.ok ? 'exito' : 'error', resultado.ok ? `Producto "${producto.nombre}" eliminado.` : resultado.error);
  }

  function confirmarRestablecer() {
    const resultado = restablecer();
    setModal(null);
    setFiltros(FILTROS_INICIALES);
    mostrarAviso(resultado.ok ? 'exito' : 'error', resultado.ok ? 'Se restablecieron los 10 productos de prueba y los gráficos de compras volvieron a cero.' : resultado.error);
  }

  return (
    <section className="contenedor admin" aria-labelledby="titulo-admin">
      <header className="panel__cabecera">
        <div>
          <h1 id="titulo-admin" className="titulo-seccion">
            Gestión de Inventario &amp; Catálogo
          </h1>
          <p className="catalogo__subtitulo">Administración CRUD de productos, sincronizada con LocalStorage.</p>
        </div>
        <div className="panel__acciones">
          <button type="button" className="boton boton--secundario" onClick={() => setModal({ tipo: 'restablecer' })}>
            Restablecer datos de prueba
          </button>
          <button type="button" className="boton boton--secundario" onClick={() => setModal({ tipo: 'categoria' })}>
            Crear categoría
          </button>
          <button type="button" className="boton boton--primario" onClick={() => setModal({ tipo: 'formulario', producto: null })}>
            + Crear nuevo producto
          </button>
        </div>
      </header>

      <AlertaAntiguos
        antiguos={antiguos}
        filtrando={filtros.soloAntiguos}
        onFiltrar={() => setFiltros({ ...filtros, soloAntiguos: !filtros.soloAntiguos })}
        onEditar={(producto) => setModal({ tipo: 'formulario', producto })}
      />

      <ResumenKpis productos={productos} />

      <GraficoCategorias productos={productos} ventas={ventas} />

      <GraficoProductos productos={productos} ventasProducto={ventasProducto} />

      <FiltrosAdmin filtros={filtros} onCambiar={setFiltros} categorias={categorias} conteo={conteo} onLimpiar={() => setFiltros(FILTROS_INICIALES)} />

      <section className="tarjeta-panel" aria-labelledby="titulo-tabla">
        <header className="panel__cabecera">
          <h2 id="titulo-tabla" className="titulo-seccion titulo-seccion--pequeno">
            Catálogo completo de productos
          </h2>
          <p className="catalogo__subtitulo" aria-live="polite">
            Mostrando {visibles.length} de {productos.length} registros
          </p>
        </header>
        <TablaProductos
          productos={visibles}
          onEditar={(producto) => setModal({ tipo: 'formulario', producto })}
          onCambiarEstado={alternarEstado}
          onBorrar={(producto) => setModal({ tipo: 'borrar', producto })}
        />
      </section>

      <EditorContacto />

      {modal && modal.tipo === 'formulario' && (
        <FormularioProducto producto={modal.producto} productos={productos} categorias={categorias} onGuardar={guardarProducto} onCerrar={() => setModal(null)} />
      )}
      {modal && modal.tipo === 'categoria' && <FormularioCategoria categorias={categorias} onGuardar={guardarCategoria} onCerrar={() => setModal(null)} />}
      {modal && modal.tipo === 'borrar' && (
        <ModalConfirmacion
          titulo="Borrar producto"
          mensaje={`¿Seguro que quieres borrar "${modal.producto.nombre}" (${modal.producto.id})? Esta acción no se puede deshacer.`}
          textoConfirmar="Sí, borrar"
          onConfirmar={confirmarBorrado}
          onCancelar={() => setModal(null)}
        />
      )}
      {modal && modal.tipo === 'restablecer' && (
        <ModalConfirmacion
          titulo="Restablecer datos de prueba"
          mensaje="Se reemplazarán TODOS los productos actuales por los 10 productos de prueba y los gráficos de compras (por categoría y por producto) volverán a cero. ¿Deseas continuar?"
          textoConfirmar="Sí, restablecer"
          onConfirmar={confirmarRestablecer}
          onCancelar={() => setModal(null)}
        />
      )}
    </section>
  );
}
