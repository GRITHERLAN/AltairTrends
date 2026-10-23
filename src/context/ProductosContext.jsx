// ============================================================
// ProductosContext.jsx
// Mantiene en memoria la lista de productos descargada de Supabase
// (mediante productosService) y expone las acciones CRUD a toda la app.
//
// Qué se descarga depende de quién mira (lo decide RLS en el servidor):
//   - Visitante o Usuario: solo productos activos.
//   - Administrador: todos los productos, más los contadores de compras
//     y las categorías creadas a mano.
// Por eso se vuelve a descargar todo cuando cambia la sesión.
// ============================================================

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  actualizarProducto,
  cambiarEstadoProducto,
  comprarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductos,
  restablecerProductos,
} from '../services/productosService';
import { crearCategoria, obtenerCategoriasExtra } from '../services/categoriasService';
import { obtenerVentasPorCategoria, obtenerVentasPorProducto } from '../services/ventasService';
import { useAuth } from './AuthContext';

const ProductosContext = createContext(null);

export function ProductosProvider({ children }) {
  const { esAdmin, cargando: cargandoSesion } = useAuth();

  const [productos, setProductos] = useState([]);
  // Compras acumuladas por categoría (alimenta el gráfico del panel de administración).
  const [ventas, setVentas] = useState({});
  // Compras acumuladas por producto: { idProducto: { nombre, cantidad } }.
  const [ventasProducto, setVentasProducto] = useState({});
  // Categorías creadas a mano por el administrador (pueden no tener productos todavía).
  const [categoriasExtra, setCategoriasExtra] = useState([]);
  const [cargando, setCargando] = useState(true);
  // "listo" pasa a true tras la PRIMERA descarga (las siguientes no vuelven a ocultar la web).
  const [listo, setListo] = useState(false);
  // true cuando los datos en memoria son los del Administrador (todos los productos).
  // Justo después del login aún son los públicos: el panel espera a que cambie.
  const [cargadoComoAdmin, setCargadoComoAdmin] = useState(false);
  const [error, setError] = useState('');

  // Descarga solo los contadores de compras (se usa también tras una compra del admin).
  const recargarVentas = useCallback(async () => {
    const [porCategoria, porProducto] = await Promise.all([obtenerVentasPorCategoria(), obtenerVentasPorProducto()]);
    setVentas(porCategoria.ventas);
    setVentasProducto(porProducto.ventasProducto);
  }, []);

  // Descarga todo lo que corresponde a quien está mirando.
  const recargar = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerProductos();
    setProductos(resultado.productos);
    setError(resultado.ok ? '' : resultado.error);

    if (esAdmin) {
      const [, extra] = await Promise.all([recargarVentas(), obtenerCategoriasExtra()]);
      setCategoriasExtra(extra.categorias);
    } else {
      // Un visitante no necesita (ni puede leer) estadísticas ni categorías extra.
      setVentas({});
      setVentasProducto({});
      setCategoriasExtra([]);
    }
    setCargadoComoAdmin(esAdmin);
    setCargando(false);
    setListo(true);
  }, [esAdmin, recargarVentas]);

  // Se descarga al arrancar (cuando ya se sabe si hay sesión) y cada vez que cambia el rol.
  useEffect(() => {
    if (!cargandoSesion) recargar();
  }, [cargandoSesion, recargar]);

  // Crea una categoría extra. "existentes" son todas las categorías que ya conoce el panel.
  async function agregarCategoria(nombre, existentes) {
    const resultado = await crearCategoria(nombre, existentes);
    if (resultado.ok) setCategoriasExtra((actuales) => [...actuales, resultado.categoria]);
    return resultado;
  }

  // Cada acción llama al servicio y, si todo salió bien, actualiza el estado local.
  async function crear(datos) {
    const resultado = await crearProducto(datos, productos);
    if (resultado.ok) setProductos((actuales) => [resultado.producto, ...actuales]);
    return resultado;
  }

  async function actualizar(idOriginal, datos) {
    const resultado = await actualizarProducto(idOriginal, datos, productos);
    if (resultado.ok) setProductos((actuales) => actuales.map((p) => (p.id === idOriginal ? resultado.producto : p)));
    return resultado;
  }

  async function eliminar(producto) {
    const resultado = await eliminarProducto(producto);
    if (resultado.ok) setProductos((actuales) => actuales.filter((p) => p.id !== producto.id));
    return resultado;
  }

  async function cambiarEstado(producto) {
    const resultado = await cambiarEstadoProducto(producto);
    if (resultado.ok) setProductos((actuales) => actuales.map((p) => (p.id === producto.id ? resultado.producto : p)));
    return resultado;
  }

  // Registra la compra en el servidor. Si quien compra es el admin, refresca sus gráficos.
  async function comprar(id) {
    const resultado = await comprarProducto(id);
    if (resultado.ok && esAdmin) await recargarVentas();
    return resultado;
  }

  async function restablecer() {
    const resultado = await restablecerProductos(productos);
    if (resultado.ok) await recargar();
    return resultado;
  }

  return (
    <ProductosContext.Provider
      value={{ productos, ventas, ventasProducto, categoriasExtra, cargando, listo, cargadoComoAdmin, error, recargar, agregarCategoria, crear, actualizar, eliminar, cambiarEstado, comprar, restablecer }}
    >
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}
