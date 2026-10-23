// ============================================================
// App.jsx
// Une los proveedores de datos, el layout (cabecera, pie, WhatsApp, avisos)
// y elige qué página mostrar según la ruta del hash.
// Los datos llegan de Supabase de forma asíncrona (ver services/).
// ============================================================

import { useEffect, useRef } from 'react';
import BotonWhatsApp from './components/layout/BotonWhatsApp';
import Cabecera from './components/layout/Cabecera';
import Pie from './components/layout/Pie';
import Avisos from './components/ui/Avisos';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AvisosProvider } from './context/AvisosContext';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { ProductosProvider, useProductos } from './context/ProductosContext';
import { useRuta } from './hooks/useRuta';
import PaginaAdmin from './pages/PaginaAdmin';
import PaginaCatalogo from './pages/PaginaCatalogo';
import PaginaContacto from './pages/PaginaContacto';
import PaginaLegal from './pages/PaginaLegal';
import PaginaLogin from './pages/PaginaLogin';
import PaginaProducto from './pages/PaginaProducto';
import PaginaSobreNosotros from './pages/PaginaSobreNosotros';

// Elige la página según el nombre de la ruta.
function Paginas({ ruta }) {
  switch (ruta.nombre) {
    case 'producto':
      return <PaginaProducto id={ruta.parametro} />;
    case 'sobre-nosotros':
      return <PaginaSobreNosotros />;
    case 'contacto':
      return <PaginaContacto />;
    case 'login':
      return <PaginaLogin />;
    case 'admin':
      return <PaginaAdmin />;
    // Documentos legales (los textos están en data/legal.js).
    case 'privacidad':
    case 'terminos':
    case 'cookies':
      return <PaginaLegal documento={ruta.nombre} />;
    default:
      return <PaginaCatalogo />;
  }
}

// Mientras llegan los datos de Supabase por PRIMERA vez se muestra un aviso de carga;
// si el catálogo no se pudo descargar, un mensaje de error con botón para reintentar.
function Contenido({ ruta }) {
  const sesion = useAuth();
  const contacto = useConfig();
  const catalogo = useProductos();

  if (sesion.cargando || !contacto.listo || !catalogo.listo) {
    return (
      <section className="contenedor vacio" aria-live="polite">
        <p className="vacio__titulo">Cargando AltairTrends...</p>
      </section>
    );
  }

  if (catalogo.error) {
    return (
      <section className="contenedor vacio" role="alert">
        <h1 className="vacio__titulo">No pudimos cargar el catálogo</h1>
        <p>{catalogo.error}</p>
        <button
          type="button"
          className="boton boton--primario"
          onClick={(evento) => {
            evento.preventDefault();
            catalogo.recargar();
            contacto.recargar();
          }}
        >
          Reintentar
        </button>
      </section>
    );
  }

  return <Paginas ruta={ruta} />;
}

export default function App() {
  const ruta = useRuta();
  const principalRef = useRef(null);
  const primeraCarga = useRef(true);

  // Navegación por teclado: al cambiar de página el foco pasa al contenido principal,
  // para que quien usa teclado o lector de pantalla no tenga que recorrer de nuevo la cabecera.
  // En la primera carga no se mueve (el navegador empieza por arriba, como siempre).
  useEffect(() => {
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }
    principalRef.current?.focus({ preventScroll: true });
  }, [ruta]);

  // Enlace "Saltar al contenido". No usa el hash (#contenido) porque el router
  // lo interpretaría como una ruta: se mueve el foco a mano.
  function saltarAlContenido(evento) {
    evento.preventDefault();
    principalRef.current?.focus();
  }

  return (
    <AvisosProvider>
      <AuthProvider>
        <ConfigProvider>
          <ProductosProvider>
            <a className="saltar-contenido" href="#contenido" onClick={saltarAlContenido}>
              Saltar al contenido principal
            </a>
            <Cabecera rutaActual={ruta.nombre} />
            {/* tabIndex -1: puede recibir el foco desde el código, pero no entra en el orden del Tab */}
            <main id="contenido" className="principal" ref={principalRef} tabIndex={-1}>
              <Contenido ruta={ruta} />
            </main>
            <Pie />
            <BotonWhatsApp />
            <Avisos />
          </ProductosProvider>
        </ConfigProvider>
      </AuthProvider>
    </AvisosProvider>
  );
}
