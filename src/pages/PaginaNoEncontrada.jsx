// ============================================================
// PaginaNoEncontrada.jsx
// Se muestra cuando la URL no corresponde a ninguna página.
// Cloudflare responde con index.html a cualquier ruta, así que esta página
// lleva "noindex" para que Google no la guarde como contenido.
// ============================================================

import { useMetaPagina } from '../hooks/useMetaPagina';

export default function PaginaNoEncontrada() {
  useMetaPagina({ titulo: 'Página no encontrada', noindex: true });

  return (
    <section className="contenedor vacio">
      <h1 className="vacio__titulo">Página no encontrada</h1>
      <p>La página que buscas no existe o cambió de dirección.</p>
      <a className="boton boton--primario" href="/">
        Ver el catálogo
      </a>
    </section>
  );
}
