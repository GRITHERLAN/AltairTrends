// ============================================================
// ProductosContext.jsx
// Mantiene la lista de productos en memoria (sincronizada con LocalStorage
// mediante productosService) y expone las acciones CRUD a toda la app.
// ============================================================

import { createContext, useContext, useState } from 'react';
import {
  actualizarProducto,
  cambiarEstadoProducto,
  comprarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductos,
  restablecerProductos,
} from '../services/productosService';
import { obtenerVentasPorCategoria, obtenerVentasPorProducto } from '../services/ventasService';

const ProductosContext = createContext(null);

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState(() => obtenerProductos());
  // Compras acumuladas por categoría (alimenta el gráfico del panel de administración).
  const [ventas, setVentas] = useState(() => obtenerVentasPorCategoria());
  // Compras acumuladas por producto: { idProducto: { nombre, cantidad } }.
  const [ventasProducto, setVentasProducto] = useState(() => obtenerVentasPorProducto());

  // Cada acción llama al servicio y, si todo salió bien, actualiza el estado.
  function crear(datos) {
    const resultado = crearProducto(datos);
    if (resultado.ok) setProductos(resultado.productos);
    return resultado;
  }

  function actualizar(idOriginal, datos) {
    const resultado = actualizarProducto(idOriginal, datos);
    if (resultado.ok) setProductos(resultado.productos);
    return resultado;
  }

  function eliminar(id) {
    const resultado = eliminarProducto(id);
    if (resultado.ok) setProductos(resultado.productos);
    return resultado;
  }

  function cambiarEstado(id) {
    const resultado = cambiarEstadoProducto(id);
    if (resultado.ok) setProductos(resultado.productos);
    return resultado;
  }

  function comprar(id) {
    const resultado = comprarProducto(id);
    if (resultado.ok) {
      setProductos(resultado.productos);
      setVentas(resultado.ventas);
      setVentasProducto(resultado.ventasProducto);
    }
    return resultado;
  }

  function restablecer() {
    const resultado = restablecerProductos();
    if (resultado.ok) {
      setProductos(resultado.productos);
      setVentas(resultado.ventas);
      setVentasProducto(resultado.ventasProducto);
    }
    return resultado;
  }

  return (
    <ProductosContext.Provider value={{ productos, ventas, ventasProducto, crear, actualizar, eliminar, cambiarEstado, comprar, restablecer }}>
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}
