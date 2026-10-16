// ============================================================
// PaginaCatalogo.jsx
// Página principal: portada + catálogo con filtros.
// Solo muestra productos con estado Activo.
// ============================================================

import { useState } from 'react';
import FiltrosUsuario from '../components/catalogo/FiltrosUsuario';
import TarjetaProducto from '../components/catalogo/TarjetaProducto';
import { useConfig } from '../context/ConfigContext';
import { useProductos } from '../context/ProductosContext';
import { FILTROS_INICIALES, filtrarProductos, obtenerCategorias } from '../utils/filtrarProductos';

export default function PaginaCatalogo() {
  const { productos } = useProductos();
  const { config } = useConfig();
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  // Solo los productos activos son visibles para el usuario.
  const activos = productos.filter((p) => p.activo);
  const categorias = obtenerCategorias(activos);
  const visibles = filtrarProductos(productos, filtros, true);
  const unidadesTotales = activos.reduce((suma, p) => suma + p.stock, 0);

  return (
    <>
      <section className="portada contenedor" aria-labelledby="titulo-portada">
        <p className="portada__etiqueta">● Stock nacional disponible</p>
        <h1 id="titulo-portada" className="portada__titulo">
          Colección Digital &amp; <span className="texto-acento">Tendencias Exclusivas</span>
        </h1>
        <p className="portada__texto">
          AltairTrends · Curaduría contemporánea de lujo accesible en Colombia con despacho nacional garantizado y
          certificación de autenticidad.
        </p>
        <ul className="portada__indicadores">
          {config.indicadores.slice(0, 4).map((indicador) => (
            <li key={indicador.etiqueta} className="portada__indicador">
              <span className="portada__indicador-etiqueta">{indicador.etiqueta}</span>
              <strong className="portada__indicador-valor">{indicador.valor}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="catalogo contenedor" aria-labelledby="titulo-catalogo">
        <header className="catalogo__cabecera">
          <div>
            <h2 id="titulo-catalogo" className="titulo-seccion">
              Catálogo Exclusivo <span className="insignia insignia--exito">Solo productos disponibles</span>
            </h2>
            <p className="catalogo__subtitulo">
              Explora piezas seleccionadas en inventario inmediato, con precios en pesos colombianos (COP).
            </p>
          </div>
          <p className="catalogo__total">
            Total unidades: <strong>{unidadesTotales} uds</strong>
          </p>
        </header>

        <FiltrosUsuario
          filtros={filtros}
          onCambiar={setFiltros}
          categorias={categorias}
          onLimpiar={() => setFiltros(FILTROS_INICIALES)}
        />

        <p className="catalogo__resultados" aria-live="polite">
          Mostrando {visibles.length} de {activos.length} productos
        </p>

        {visibles.length > 0 ? (
          <ul className="catalogo__rejilla">
            {visibles.map((producto) => (
              <li key={producto.id}>
                <TarjetaProducto producto={producto} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="vacio">
            <p className="vacio__titulo">No encontramos productos con esos filtros.</p>
            <button type="button" className="boton boton--secundario" onClick={() => setFiltros(FILTROS_INICIALES)}>
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </>
  );
}
