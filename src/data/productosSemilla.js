// ============================================================
// productosSemilla.js
// 10 productos de prueba. Se cargan solo si LocalStorage está vacío
// (o cuando el administrador pulsa "Restablecer datos de prueba").
// No tienen imágenes: la web muestra un marcador con el logo.
// ============================================================

// Enlace de compra por defecto (el administrador puede cambiarlo por producto).
const ENLACE_COMPRA = 'https://wa.link/vtp65t';

// Devuelve una fecha ISO situada "dias" días en el pasado.
// Sirve para simular productos ingresados hace tiempo y probar la alerta de 20 días.
function haceDias(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha.toISOString();
}

// Construye la lista (se hace en una función para que las fechas sean relativas a "hoy").
export function crearProductosSemilla() {
  return [
    {
      id: 'ALT-109',
      nombre: 'Smart Ring Biomédico Pulse',
      descripcion: 'Sensor óptico PPG médico, lectura continua de temperatura basal, SpO2 y ritmo cardíaco. Titanio grado aeroespacial.',
      precio: 680000,
      categoria: 'Tecnología & Wearables',
      stock: 15,
      multimedia: [],
      enlaceCompra: ENLACE_COMPRA,
      activo: true,
      fechaCreacion: haceDias(2),
    },
    {
      id: 'ALT-104',
      nombre: 'Auriculares Wireless Noise Cancelling',
      descripcion: 'Cancelación activa de ruido híbrida de 42 dB, drivers de neodimio de 40 mm y hasta 36 horas de autonomía.',
      precio: 495000,
      categoria: 'Tecnología & Wearables',
      stock: 5,
      multimedia: [],
      enlaceCompra: ENLACE_COMPRA,
      activo: true,
      fechaCreacion: haceDias(5),
    },
    {
      id: 'ALT-102',
      nombre: 'Reloj Cronógrafo Altair Obsidian',
      descripcion: 'Maquinaria japonesa de cuarzo de alta precisión, cristal de zafiro irrayable y caja de acero quirúrgico 316L.',
      precio: 850000,
      categoria: 'Joyería Fina',
      stock: 8,
      multimedia: [],
      enlaceCompra: ENLACE_COMPRA,
      activo: true,
      fechaCreacion: haceDias(8),
    },
    {
      id: 'ALT-101',
      nombre: 'Chaqueta Biker Cuero Premium',
      descripcion: 'Confección premium en cuero italiano con acabados mate hidrófugos, forro interior de seda y herrajes negros.',
      precio: 380000,
      categoria: 'Moda & Accesorios',
      stock: 14,
      multimedia: [],
      enlaceCompra: ENLACE_COMPRA,
      activo: true,
      fechaCreacion: haceDias(12),
    },
    {
      id: 'ALT-110',
      nombre: 'Anillo Solitario Plata 925',
      descripcion: 'Plata de ley 925 con triple baño de rodio antialérgico y piedra central de circón de corte brillante.',
      precio: 180000,
      categoria: 'Joyería Fina',
      stock: 20,
      multimedia: [],
      enlaceCompra: ENLACE_COMPRA,
      activo: true,
      fechaCreacion: haceDias(15),
    },
    {
      id: 'ALT-107',
      nombre: "Perfume Extracto 'Nébula'",
      descripcion: 'Concentración extrait al 30%. Notas de salida de bergamota ahumada e incienso, fondo de ámbar y vainilla.',
      precio: 420000,
      categoria: 'Perfumería',
      stock: 9,
      multimedia: [],
      enlaceCompra: ENLACE_COMPRA,
      activo: true,
      fechaCreacion: haceDias(18),
    },
    {
      id: 'ALT-106',
      nombre: 'Gafas de Sol Titanio Aviator',
      descripcion: 'Montura en aleación de titanio aeroespacial ultraligera de 18 g, lentes polarizados con protección UV400.',
      precio: 210000,
      categoria: 'Moda & Accesorios',
      stock: 18,
      multimedia: [],
      enlaceCompra: ENLACE_COMPRA,
      activo: false, // Producto inactivo de ejemplo: no se muestra a los usuarios.
      fechaCreacion: haceDias(19),
    },
    {
      id: 'ALT-108',
      nombre: 'Botines Chelsea Cuero Italiano',
      descripcion: 'Gamuza vacuna hidrofugada de origen europeo, elásticos laterales de alta resistencia y suela de goma.',
      precio: 365000,
      categoria: 'Calzado de Autor',
      stock: 7,
      multimedia: [],
      enlaceCompra: ENLACE_COMPRA,
      activo: true,
      fechaCreacion: haceDias(26), // Más de 20 días: dispara la alerta del panel.
    },
    {
      id: 'ALT-105',
      nombre: 'Bolso Tote Estructurado',
      descripcion: 'Silueta geométrica atemporal en cuero premium con herrajes bañados en paladio y compartimento interior.',
      precio: 340000,
      categoria: 'Moda & Accesorios',
      stock: 12,
      multimedia: [],
      enlaceCompra: ENLACE_COMPRA,
      activo: true,
      fechaCreacion: haceDias(34), // Más de 20 días: dispara la alerta del panel.
    },
    {
      id: 'ALT-103',
      nombre: 'Sneakers Minimalistas Nappa',
      descripcion: 'Piel nappa premium de tacto ultrasuave, suela de caucho vulcanizado cosida a mano y plantilla ergonómica.',
      precio: 290000,
      categoria: 'Calzado de Autor',
      stock: 22,
      multimedia: [],
      enlaceCompra: ENLACE_COMPRA,
      activo: false, // Segundo producto inactivo de ejemplo.
      fechaCreacion: haceDias(10),
    },
  ];
}
