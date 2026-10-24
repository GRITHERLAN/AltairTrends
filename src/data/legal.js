// ============================================================
// legal.js
// Textos de los documentos legales de AltairTrends (Colombia):
//   - Política de Tratamiento de Datos Personales (Ley 1581 de 2012).
//   - Términos y Condiciones de Uso (Ley 1480 de 2011, Estatuto del Consumidor).
//   - Política de Cookies.
//
// Están escritos en lenguaje sencillo, para personas sin conocimientos
// técnicos ni jurídicos (sin palabras de programación o sistemas).
// Cada documento es una lista de secciones { titulo, parrafos, lista }.
// La página PaginaLegal.jsx los pinta; el correo y el teléfono del
// Responsable salen de la configuración de Contacto (panel admin).
//
// IMPORTANTE: si cambia el contenido de la Política de privacidad,
// actualiza VERSION_POLITICA y FECHA_VIGENCIA. La versión se guarda con
// cada mensaje de Contacto como prueba de qué texto autorizó la persona.
//
// Plazos que estos textos prometen y que la base de datos ya cumple sola
// (ver supabase/migrations/20261023000002_limpieza_automatica.sql):
//   - Mensajes de Contacto: se borran a los 12 meses.
//   - Datos técnicos anti-abusos: se borran a las 24 horas.
// ============================================================

// Versión de la Política de privacidad (máx. 20 caracteres) y fecha desde la que rige.
export const VERSION_POLITICA = '2026-10-24-2';
export const FECHA_VIGENCIA = '24 de octubre de 2026';

// Responsable del tratamiento y proveedor de la tienda (persona natural).
export const RESPONSABLE = {
  nombre: 'Natalia García Ramírez',
  ciudad: 'Dosquebradas, Risaralda, Colombia',
  marca: 'AltairTrends',
};

// ---------- Política de Tratamiento de Datos Personales ----------
const PRIVACIDAD = {
  ruta: '/privacidad',
  titulo: 'Política de Tratamiento de Datos Personales',
  resumen:
    'Aquí te contamos qué datos tuyos pedimos en AltairTrends, para qué los usamos, cuánto tiempo los guardamos y cómo puedes pedirnos que los cambiemos o los borremos.',
  secciones: [
    {
      titulo: '1. En qué ley nos basamos',
      parrafos: [
        'Esta política cumple la ley colombiana que protege los datos personales (Ley 1581 de 2012 y Decreto 1377 de 2013).',
      ],
    },
    {
      titulo: '2. Palabras que usamos',
      lista: [
        'Datos personales: información que permite saber quién eres, como tu nombre o tu correo.',
        'Tratar datos: guardarlos, usarlos, enviarlos o borrarlos.',
        'Tú (titular): la persona a la que pertenecen los datos.',
        'Autorizar: darnos permiso de forma voluntaria, sabiendo para qué usaremos tus datos.',
      ],
    },
    {
      titulo: '3. Qué datos pedimos',
      lista: [
        'Formulario de Contacto: tu nombre, tu correo y el mensaje que escribes.',
        'Cuentas de acceso: solo las crea la tienda. Guardamos tu correo y tu nombre. Tu contraseña se guarda convertida en una clave secreta que nadie puede volver a leer, ni siquiera nosotros.',
        'Número de tu conexión a internet (dirección IP): lo usamos cuando envías un mensaje o pulsas Comprar, solo para frenar abusos y programas automáticos. No lo guardamos tal cual, sino convertido en un código que no permite saber cuál es tu número, y lo borramos al día siguiente.',
        'No pedimos datos delicados, como salud, creencias religiosas u origen. Tampoco pedimos datos de tarjetas ni de cuentas bancarias: en esta página no se paga.',
        'La página no es para menores de 18 años. Si nos llega información de un menor sin permiso de sus padres, la borramos.',
      ],
    },
    {
      titulo: '4. Para qué los usamos',
      lista: [
        'Responder las preguntas, quejas o solicitudes que nos envíes por el formulario de Contacto.',
        'Permitir que entres a tu cuenta y mantenerla segura.',
        'Evitar fraudes, mensajes basura y ataques a la página.',
        'Contar cuántas veces se pulsa Comprar en cada producto, para saber cuáles interesan más. Esos conteos no están ligados a ninguna persona.',
        'Cumplir la ley cuando una autoridad nos lo pida.',
      ],
    },
    {
      titulo: '5. Tu permiso',
      parrafos: [
        'Antes de enviar el formulario de Contacto debes marcar una casilla que dice que nos autorizas a usar tus datos. La casilla viene sin marcar: si no la marcas, el mensaje no se envía. Nunca tomamos tu silencio como un permiso.',
        'Guardamos la fecha y la versión de esta política que aceptaste, para poder demostrarlo.',
        'Puedes retirar tu permiso cuando quieras escribiéndonos al correo de contacto. Si la ley nos obliga a conservar algún dato, te diremos cuál.',
      ],
    },
    {
      titulo: '6. Tus derechos',
      lista: [
        'Saber qué datos tuyos tenemos.',
        'Corregir tus datos si están mal o desactualizados.',
        'Pedir que borremos tus datos.',
        'Retirar tu permiso en cualquier momento.',
        'Saber para qué usamos tus datos.',
        'Pedir una copia de tus datos sin costo, al menos una vez al mes.',
        'Presentar una queja ante la Superintendencia de Industria y Comercio (SIC) si no atendemos bien tu solicitud.',
      ],
    },
    {
      titulo: '7. Cómo pedir algo sobre tus datos',
      parrafos: [
        'Escríbenos al correo de contacto con el asunto "Datos personales". Cuéntanos tu nombre, el correo con el que nos escribiste y lo que quieres pedir.',
      ],
      lista: [
        'Si quieres saber qué datos tuyos tenemos: te respondemos en máximo 10 días hábiles.',
        'Si quieres corregirlos, borrarlos o retirar tu permiso: te respondemos en máximo 15 días hábiles. Si necesitamos más tiempo, te avisamos el motivo.',
        'Si tu solicitud está incompleta, te pediremos completarla en los primeros 5 días. Si no lo haces en 2 meses, la damos por cerrada.',
        'Antes de cambiar o entregar información, podemos pedirte que confirmes que eres tú.',
      ],
    },
    {
      titulo: '8. Empresas que nos ayudan',
      parrafos: [
        'Para que la página funcione usamos servicios de otras empresas. Ellas guardan información en computadores ubicados fuera de Colombia, principalmente en Estados Unidos, y solo la usan para prestarnos su servicio:',
      ],
      lista: [
        'Supabase: guarda la información de la tienda, las cuentas de acceso y las imágenes de los productos.',
        'Vercel: mantiene la página publicada en internet.',
      ],
    },
    {
      titulo: '9. Cómo cuidamos tus datos',
      lista: [
        'Lo que escribes en la página viaja protegido (verás un candado junto a la dirección en tu navegador).',
        'Tu nombre, tu correo y tu mensaje se guardan con una clave secreta: sin ella no se pueden leer.',
        'Solo la administradora de la tienda puede ver los mensajes y la información de las cuentas.',
        'Las contraseñas se guardan de forma que nadie, ni siquiera la tienda, puede leerlas.',
        'Ningún sistema es perfecto, pero estas son las medidas que tomamos para cuidarte.',
      ],
    },
    {
      titulo: '10. Cuánto tiempo guardamos los datos',
      lista: [
        'Mensajes del formulario de Contacto: hasta 12 meses. Después se borran solos.',
        'Cuentas de acceso: mientras la cuenta esté activa.',
        'Código de tu conexión a internet: se borra a las 24 horas.',
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
    'Son las reglas para usar el catálogo de AltairTrends y los derechos que tienes como comprador según la ley colombiana.',
  secciones: [
    {
      titulo: '1. Aceptar estas reglas',
      parrafos: [
        'Al usar esta página aceptas estas reglas, la política de tratamiento de datos personales y la política de cookies. Si no estás de acuerdo, te pedimos no usarla.',
        'Estas reglas se rigen por las leyes de Colombia, en especial el Estatuto del Consumidor (Ley 1480 de 2011) y la ley de comercio electrónico (Ley 527 de 1999).',
      ],
    },
    {
      titulo: '2. Qué es esta página',
      parrafos: [
        'Es un catálogo: muestra productos, precios y cuántas unidades hay. En esta página no se cobra nada.',
        'El botón Comprar te lleva a WhatsApp u otro canal de venta. Allí se confirman el precio final, el envío y el pago, y allí se cierra la compra. Cuando pulsas Comprar, la página solo anota que hubo interés en ese producto: no descuenta unidades ni reserva el producto.',
      ],
    },
    {
      titulo: '3. Productos y precios',
      lista: [
        'Los precios están en pesos colombianos (COP). Confirma el precio final antes de pagar.',
        'El costo del envío se te informa antes de pagar.',
        'Las unidades disponibles pueden cambiar. Confírmalas en el canal de venta.',
        'Las fotos y los videos son de referencia. El color puede verse distinto según tu pantalla.',
        'Si un precio tiene un error evidente, te avisamos antes de cerrar la venta para que decidas si quieres continuar.',
      ],
    },
    {
      titulo: '4. Devolver una compra (derecho de retracto)',
      parrafos: [
        'Si compraste a distancia (por internet, WhatsApp o teléfono), puedes arrepentirte y devolver el producto dentro de los 5 días hábiles siguientes a recibirlo, siempre que esté sin usar y en buen estado. El costo del envío de la devolución lo pagas tú.',
        'Te devolvemos el dinero en máximo 30 días calendario después de recibir el producto de vuelta, siempre que nos des datos correctos para hacerte la devolución.',
        'Esto no aplica en los casos que la ley exceptúa, como los productos hechos a la medida o personalizados.',
      ],
    },
    {
      titulo: '5. Si pagaste y algo salió mal',
      parrafos: [
        'Puedes pedir que te devuelvan el pago dentro de los 5 días hábiles siguientes a enterarte del problema si te cobraron algo que no compraste, si el producto no llegó, o si llegó dañado o distinto a lo que pediste.',
        'Avísanos y avisa también a tu banco o al medio de pago que usaste.',
      ],
    },
    {
      titulo: '6. Garantía',
      parrafos: [
        'Todos los productos tienen garantía legal. Si un producto llega defectuoso o no sirve para lo que se anunció, escríbenos y buscamos una solución: repararlo, cambiarlo o devolverte tu dinero.',
        'El tiempo de la garantía es el que indique el fabricante o la tienda para cada producto. Si no se indica ninguno, se aplica el que fija la ley.',
      ],
    },
    {
      titulo: '7. Quejas y reclamos',
      parrafos: [
        'Puedes escribirnos por el formulario de Contacto, por correo o por teléfono. Te respondemos en máximo 15 días hábiles.',
        'Si no quedas conforme con la respuesta, puedes acudir a la Superintendencia de Industria y Comercio (www.sic.gov.co), la entidad que protege a los consumidores.',
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
        'Intentar entrar a zonas de administración o a información que no es tuya.',
        'Usar programas automáticos para llenar formularios o para copiar todo el catálogo.',
        'Hacerte pasar por otra persona o usar datos de otras personas sin su permiso.',
        'Escribir mensajes ofensivos, falsos o que engañen a otras personas.',
      ],
    },
    {
      titulo: '10. Derechos sobre el contenido',
      parrafos: [
        'El nombre AltairTrends, el logo, los textos y el diseño de la página son de la tienda. No los copies ni los uses sin permiso escrito. Están protegidos por las leyes colombianas de derechos de autor y de propiedad industrial.',
        'Las fotos y los videos de los productos son de la tienda o del fabricante, y se muestran con su permiso. Si una imagen es tuya y no autorizaste su uso, escríbenos y la quitamos.',
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
        'Hacemos lo posible para que la página funcione siempre, pero a veces puede no estar disponible por mantenimiento o por problemas que no dependen de nosotros.',
        'Nada de lo escrito aquí te quita los derechos que la ley te da como consumidor.',
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
  resumen: 'Te explicamos qué información guarda esta página en tu navegador, para qué sirve y cómo puedes borrarla.',
  secciones: [
    {
      titulo: '1. Qué es una cookie',
      parrafos: [
        'Una cookie es un pequeño dato que una página guarda en tu navegador (Chrome, Edge, Firefox, Safari...) para recordar algo. Por ejemplo, que ya iniciaste sesión.',
        'Algunas páginas guardan ese recuerdo de otra forma, en un espacio del navegador parecido a una cookie. En esta política hablamos de ambas como "cookies".',
      ],
    },
    {
      titulo: '2. Qué guardamos',
      parrafos: [
        'Solo guardamos lo necesario para que tu sesión siga abierta cuando entras con tu cuenta. Sin eso tendrías que escribir tu contraseña cada vez que cambias de página o recargas.',
        'No usamos cookies de publicidad, no seguimos lo que haces en otras páginas y no guardamos estadísticas que te identifiquen.',
      ],
    },
    {
      titulo: '3. Cuándo se guarda',
      parrafos: [
        'Solo cuando inicias sesión con tu cuenta. Se borra cuando cierras sesión.',
        'Si solo miras el catálogo sin iniciar sesión, la página no guarda nada tuyo en tu navegador.',
      ],
    },
    {
      titulo: '4. Servicios de otras empresas',
      lista: [
        'Cuando pulsas WhatsApp o Comprar sales de nuestra página, y ese servicio aplica sus propias reglas de cookies.',
      ],
    },
    {
      titulo: '5. Tu permiso',
      parrafos: [
        'Como lo que guardamos es necesario para que puedas usar tu cuenta, no te pedimos un permiso aparte. Si en el futuro usamos cookies que no sean necesarias, te pediremos permiso antes con un aviso en la página.',
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
