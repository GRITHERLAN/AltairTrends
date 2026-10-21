// ============================================================
// App.jsx
// Une los proveedores de datos, el layout (cabecera, pie, WhatsApp, avisos)
// y elige qué página mostrar según la ruta del hash.
// ============================================================

import BotonWhatsApp from './components/layout/BotonWhatsApp';
import Cabecera from './components/layout/Cabecera';
import Pie from './components/layout/Pie';
import Avisos from './components/ui/Avisos';
import { AuthProvider } from './context/AuthContext';
import { AvisosProvider } from './context/AvisosContext';
import { ConfigProvider } from './context/ConfigContext';
import { ProductosProvider } from './context/ProductosContext';
import { useRuta } from './hooks/useRuta';
import PaginaAdmin from './pages/PaginaAdmin';
import PaginaCatalogo from './pages/PaginaCatalogo';
import PaginaContacto from './pages/PaginaContacto';
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
    default:
      return <PaginaCatalogo />;
  }
}

export default function App() {
  const ruta = useRuta();

  return (
    <AvisosProvider>
      <AuthProvider>
        <ConfigProvider>
          <ProductosProvider>
            <Cabecera rutaActual={ruta.nombre} />
            <main className="principal">
              <Paginas ruta={ruta} />
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
