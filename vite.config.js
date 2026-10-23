// Configuración de Vite: plugin de React y cabeceras de seguridad.
//
// Las cabeceras de PRODUCCIÓN están en vercel.json (Vercel las envía con cada
// respuesta). Aquí se repiten para poder probarlas en local:
//   - "npm run preview" (build final): todas, incluida la CSP.
//   - "npm run dev": todas menos la CSP y HSTS, porque el modo desarrollo de
//     Vite inyecta scripts en línea y usa http://localhost.
// Si cambias una cabecera, cámbiala también en vercel.json.
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Cabeceras comunes a desarrollo y vista previa.
const CABECERAS_BASE = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
};

// Política de seguridad de contenido: solo se ejecuta código propio y solo se
// conecta con nuestro proyecto de Supabase.
function politicaContenido(urlSupabase) {
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data: blob: https:",
    "media-src 'self' blob: https:",
    "font-src 'self'",
    `connect-src 'self' ${urlSupabase}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');
}

export default defineConfig(({ mode }) => {
  const entorno = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    server: {
      headers: CABECERAS_BASE,
    },
    preview: {
      headers: { ...CABECERAS_BASE, 'Content-Security-Policy': politicaContenido(entorno.VITE_SUPABASE_URL) },
    },
  };
});
