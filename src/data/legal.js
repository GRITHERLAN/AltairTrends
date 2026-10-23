// ============================================================
// legal.js
// Textos de los documentos legales de AltairTrends (Colombia):
//   - Política de Tratamiento de Datos Personales (Ley 1581 de 2012).
//   - Términos y Condiciones de Uso (Ley 1480 de 2011, Estatuto del Consumidor).
//   - Política de Cookies.
//
// Están escritos en lenguaje sencillo, para personas sin conocimientos
// técnicos ni jurídicos. Cada documento es una lista de secciones
// { titulo, parrafos, lista }. La página PaginaLegal.jsx los pinta; el
// correo y el teléfono del Responsable salen de la configuración de
// Contacto (panel admin).
//
// IMPORTANTE: si cambia el contenido de la Política de privacidad,
// actualiza VERSION_POLITICA y FECHA_VIGENCIA. La versión se guarda con
// cada mensaje de Contacto como prueba de qué texto autorizó la persona.
// ============================================================

// Versión de la Política de privacidad (máx. 20 caracteres) y fecha desde la que rige.
export const VERSION_POLITICA = '2026-10-23-2';
export const FECHA_VIGENCIA = '23 de octubre de 2026';

// Responsable del tratamiento y proveedor de la tienda (persona natural).
export const RESPONSABLE = {
  nombre: 'Natalia García Ramírez',
  documento: 'Cédula de ciudadanía 1.088.350.511',
  direccion: 'Calle 43 # 7-29',
  ciudad: 'Dosquebradas, Risaralda, Colombia',
  marca: 'AltairTrends',
};

// ---------- Política de Tratamiento de Datos Personales ----------
const PRIVACIDAD = {
  ruta: '/privacidad',
  titulo: 'Política de Tratamiento de Datos Personales',
  resumen:
    'Aquí explicamos qué datos personales pedimos en AltairTrends, para qué los usamos, cuánto tiempo los guardamos y cómo puedes pedir que los cambiemos o los borremos.',
  secciones: [
    {
      titulo: '1. Base legal',
      parrafos: [
        'Esta política cumple la Ley 1581 de 2012 y el Decreto 1377 de 2013 de Colombia, que protegen los datos personales de las personas.',
      ],
    },
    {
      titulo: '2. Palabras que usamos',
      lista: [
        'Datos personales: información que permite saber quién eres, como tu nombre o tu correo.',
        'Tratar datos: guardarlos, usarlos, mostrarlos, enviarlos o borrarlos.',
        'Tú (titular): la persona a la que pertenecen los datos.',
        'Autorizar: dar permiso de forma voluntaria, sabiendo para qué se usan.',
      ],
    },
    {
      titulo: '3. Qué datos pedimos',
      lista: [
        'Formulario de Contacto: tu nombre, tu correo y el mensaje que escribes.',
        'Cuentas de acceso: solo las crea la tienda. Guardamos tu correo y tu nombre. Tu contraseña no se guarda tal cual: se transforma en un código que no se puede volver a leer.',
        'Datos técnicos: la dirección IP de tu conexión (el número que identifica tu internet) cuando envías un mensaje o pulsas Comprar. Se guarda en forma de código y solo sirve para frenar robots y abusos.',
        'No pedimos datos sensibles, como salud, creencias religiosas u origen. Tampoco pedimos datos bancarios: en esta página no se paga.',
        'La página no es para menores de 18 años. Si nos llega información de un menor sin permiso de sus padres, la borramos.',
      ],
    },
    {
      titulo: '4. Para qué los usamos',
      lista: [
        'Responder tus preguntas, quejas o solicitudes que nos envíes por el formulario de Contacto.',
        'Permitir que entres a tu cuenta y mantenerla segura.',
        'Evitar robots, fraudes y ataques a la página.',
        'Contar cuántas veces se pulsa Comprar en cada producto, para ver qué se vende más. Esos conteos no se asocian a ninguna persona.',
        'Cumplir la ley cuando una autoridad nos lo pida.',
      ],
    },
    {
      titulo: '5. Tu permiso',
      parrafos: [
        'Antes de enviar el formulario de Contacto debes marcar una casilla que dice que autorizas el uso de tus datos. La casilla viene desmarcada: si no la marcas, el mensaje no se envía. Nunca tomamos tu silencio como permiso.',
        'Guardamos la fecha y la versión de esta política que aceptaste, para poder demostrarlo.',
        'Puedes quitar tu permiso cuando quieras. Solo tienes que escribirnos al correo de contacto. Si la ley nos obliga a guardar algún dato, te diremos cuál.',
      ],
    },
    {
      titulo: '6. Tus derechos',
      lista: [
        'Saber qué datos tuyos tenemos.',
        'Corregir tus datos si están mal o desactualizados.',
        'Pedir que borremos tus datos.',
        'Quitar tu permiso en cualquier momento.',
        'Saber cómo usamos tus datos.',
        'Pedir tus datos sin costo, al menos una vez al mes.',
        'Presentar una queja ante la Superintendencia de Industria y Comercio (SIC) si no atendemos bien tu solicitud.',
      ],
    },
    {
      titulo: '7. Cómo pedir algo sobre tus datos',
      parrafos: [
        'Escribe al correo de contacto con el asunto "Datos personales". Incluye tu nombre, el correo con el que nos escribiste y lo que quieres pedir.',
      ],
      lista: [
        'Consultas (saber qué datos tenemos): te respondemos en máximo 10 días hábiles.',
        'Correcciones, borrados o quitar tu permiso: te respondemos en máximo 15 días hábiles. Si necesitamos más tiempo, te avisamos el motivo.',
        'Si tu solicitud está incompleta, te pediremos completarla en 5 días. Si no lo haces en 2 meses, la cerramos.',
        'Podemos pedirte que confirmes que eres tú antes de cambiar o entregar información.',
      ],
    },
    {
      titulo: '8. Empresas que nos ayudan',
      parrafos: [
        'Para que la página funcione usamos servicios de otras empresas. Ellas guardan la información en servidores fuera de Colombia, principalmente en Estados Unidos, y solo la usan para prestarnos el servicio:',
      ],
      lista: [
        'Supabase: guarda la base de datos, las cuentas de acceso y las imágenes de los productos.',
        'Vercel: publica la página en internet.',
        'Cloudflare: administra el nombre de la página (el dominio) y la protege de ataques.',
      ],
    },
    {
      titulo: '9. Cómo protegemos tus datos',
      lista: [
        'La página usa conexión cifrada (HTTPS): lo que escribes viaja protegido.',
        'Los mensajes del formulario de Contacto se guardan cifrados: nadie puede leerlos directamente desde la página.',
        'Solo el administrador puede ver la información de los demás usuarios.',
        'Las contraseñas se guardan de forma que ni siquiera la tienda puede leerlas.',
        'Ningún sistema es perfecto, pero estas son las medidas que tomamos.',
      ],
    },
    {
      titulo: '10. Cuánto tiempo guardamos los datos',
      lista: [
        'Mensajes del formulario de Contacto: hasta 12 meses. Después se borran.',
        'Cuentas de acceso: mientras la cuenta esté activa.',
        'Datos técnicos (la dirección IP): se borran en pocos días.',
      ],
    },
    {
      titulo: '11. Cambios en esta política',
      parrafos: [
        'Si cambiamos esta política, la publicaremos aquí con una nueva versión y una nueva fecha. Si cambiamos para qué usamos tus datos, te pediremos permiso otra vez.',
      ],
    },
  ],
};

// ---------- Términos y Condiciones de Uso ----------
const TERMINOS = {
  ruta: '/terminos',
  titulo: 'Términos y Condiciones de Uso',
  resumen:
    'Son las reglas para usar el catálogo de AltairTrends, y tus derechos como comprador según la ley colombiana.',
  secciones: [
    {
      titulo: '1. Aceptar estas reglas',
      parrafos: [
        'Al usar esta página aceptas estos términos, la política de tratamiento de datos y la política de cookies. Si no estás de acuerdo, no uses la página.',
        'Estas reglas se rigen por las leyes de Colombia, en especial el Estatuto del Consumidor (Ley 1480 de 2011) y la ley de comercio electrónico (Ley 527 de 1999).',
      ],
    },
    {
      titulo: '2. Qué es esta página',
      parrafos: [
        'Es un catálogo: muestra productos, precios y disponibilidad. Aquí no se cobra nada.',
        'El botón Comprar te lleva a WhatsApp u otro canal de venta. Ahí se confirman el precio final, el envío y el pago, y ahí se cierra la venta.',
      ],
    },
    {
      titulo: '3. Productos y precios',
      lista: [
        'Los precios están en pesos colombianos (COP). Confirma el precio final antes de pagar.',
        'El costo de envío se informa antes de pagar.',
        'La cantidad disponible puede cambiar. Confírmala en el canal de venta.',
        'Las fotos y videos son referenciales. Puede haber diferencias de color según tu pantalla.',
        'Si un precio tiene un error evidente, te avisamos antes de cerrar la venta para que decidas si sigues.',
      ],
    },
    {
      titulo: '4. Devolver una compra (derecho de retracto)',
      parrafos: [
        'Si compras por internet, puedes devolver el producto dentro de los 5 días hábiles siguientes a recibirlo, siempre que esté sin usar y en buen estado. El costo del envío de la devolución lo pagas tú.',
        'Te devolvemos el dinero en máximo 15 días calendario después de recibir el producto de vuelta, siempre que nos des datos correctos para el reembolso.',
        'No aplica en los casos que la ley excluye, como productos hechos a la medida o personalizados.',
      ],
    },
    {
      titulo: '5. Si pagaste y algo salió mal',
      parrafos: [
        'Puedes pedir que se devuelva el pago dentro de los 5 días hábiles siguientes a enterarte del problema, si te cobraron algo que no compraste, si el producto no llegó, o si llegó dañado o distinto a lo pedido.',
        'Avísanos y también avisa a tu banco o al medio de pago que usaste.',
      ],
    },
    {
      titulo: '6. Garantía',
      parrafos: [
        'Todos los productos tienen garantía legal. Si un producto llega defectuoso o no sirve para lo que se anunció, escríbenos.',
        'Los productos nuevos tienen garantía de un año desde que los recibes, salvo que se indique otro plazo.',
      ],
    },
    {
      titulo: '7. Quejas y reclamos',
      parrafos: [
        'Puedes escribirnos por el formulario de Contacto, por correo o por teléfono. Respondemos en máximo 15 días hábiles.',
        'Si no quedas conforme con la respuesta, puedes acudir a la Superintendencia de Industria y Comercio (www.sic.gov.co), que protege a los consumidores.',
      ],
    },
    {
      titulo: '8. Cuentas de acceso',
      parrafos: [
        'Las cuentas las crea la tienda. Tu contraseña es personal: no la compartas. Si crees que alguien entró a tu cuenta, avísanos de inmediato.',
      ],
    },
    {
      titulo: '9. Lo que no puedes hacer',
      lista: [
        'Intentar entrar a zonas de administración o a datos que no son tuyos.',
        'Usar robots para llenar formularios o para copiar todo el catálogo.',
        'Hacerte pasar por otra persona o usar datos de terceros sin permiso.',
        'Publicar contenido ofensivo, falso o que engañe a otras personas.',
      ],
    },
    {
      titulo: '10. Derechos sobre el contenido',
      parrafos: [
        'El nombre AltairTrends, el logo, los textos y el diseño de la página son de la tienda. No los copies ni los uses sin permiso escrito. Están protegidos por las leyes colombianas de derechos de autor y de propiedad industrial.',
        'Las fotos y videos de los productos son de la tienda o del fabricante, y se muestran con su permiso. Si una imagen es tuya y no autorizaste su uso, escríbenos y la quitamos.',
      ],
    },
    {
      titulo: '11. Enlaces a otras páginas',
      parrafos: [
        'Algunos botones, como el de WhatsApp, te llevan a otros servicios. Esos servicios tienen sus propias reglas y su propia política de privacidad.',
      ],
    },
    {
      titulo: '12. Fallas de la página',
      parrafos: [
        'Hacemos lo posible para que la página funcione siempre, pero a veces puede caerse por mantenimiento o por fallas ajenas a nosotros.',
        'Nada de lo escrito aquí te quita los derechos que te da la ley como consumidor.',
      ],
    },
    {
      titulo: '13. Cambios en estas reglas',
      parrafos: [
        'Podemos actualizar estas reglas. La versión vigente, con su fecha, siempre estará publicada en esta página.',
      ],
    },
  ],
};

// ---------- Política de Cookies ----------
const COOKIES = {
  ruta: '/cookies',
  titulo: 'Política de Cookies',
  resumen: 'Explicamos qué información guarda esta página en tu navegador, para qué sirve y cómo puedes borrarla.',
  secciones: [
    {
      titulo: '1. Qué es una cookie',
      parrafos: [
        'Una cookie es un pequeño dato que una página guarda en tu navegador (Chrome, Edge, Firefox, Safari...) para recordar algo. Por ejemplo, que ya iniciaste sesión.',
      ],
    },
    {
      titulo: '2. Qué guardamos',
      parrafos: [
        'AltairTrends solo guarda lo necesario para que tu sesión siga iniciada. Sin ese dato tendrías que escribir tu contraseña en cada página.',
        'No usamos cookies de publicidad, no seguimos tu actividad en otras páginas y no guardamos estadísticas que te identifiquen.',
      ],
    },
    {
      titulo: '3. Cuándo se guarda',
      parrafos: [
        'Solo cuando inicias sesión con tu cuenta. Se borra cuando cierras sesión.',
      ],
    },
    {
      titulo: '4. Servicios de otras empresas',
      lista: [
        'Cloudflare puede guardar una cookie técnica para distinguir a una persona de un robot. No es de publicidad.',
        'Cuando pulsas WhatsApp o Comprar sales de la página, y ese servicio aplica sus propias reglas de cookies.',
      ],
    },
    {
      titulo: '5. Tu permiso',
      parrafos: [
        'Como la sesión es necesaria para usar tu cuenta, no te pedimos un permiso aparte. Si en el futuro usamos cookies que no sean necesarias, te pediremos permiso antes, con un aviso en la página.',
      ],
    },
    {
      titulo: '6. Cómo borrarlas',
      parrafos: [
        'Puedes cerrar sesión en la página, o borrar los datos de esta página desde la configuración de tu navegador (busca "borrar datos de navegación").',
        'Si las borras, tendrás que volver a iniciar sesión.',
      ],
    },
  ],
};

// Todos los documentos, por nombre de ruta (los usan App.jsx, el pie de página y PaginaLegal).
export const DOCUMENTOS_LEGALES = {
  privacidad: PRIVACIDAD,
  terminos: TERMINOS,
  cookies: COOKIES,
};
